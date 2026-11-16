/**
 * Sai Paper Product enquiry API v3 — faster processing + reliable acknowledgement.
 * REDEPLOY IN THE EXISTING WEB APP PROJECT:
 * Deploy > Manage deployments > Edit > Version: New version > Deploy.
 * Execute as Me; Who has access: Anyone.
 * Keep the existing /exec URL (the website is already configured for it).
 */
const CONFIG = Object.freeze({
  to: 'saipaper25@gmail.com',
  website: 'https://www.saipaper.in',
  whatsapp: 'https://wa.me/919834934303',
  timeZone: 'Asia/Kolkata'
});
const PRODUCTS = Object.freeze([
  'Chromo Barcode Labels', 'Direct Thermal Labels', 'Shipping Labels',
  'Printed Barcode Labels', 'Color Barcode Labels', 'Printed Product Labels',
  'Barcode Printers', 'Plain Labels', 'Security Labels',
  'Thermal Transfer Ribbons', 'Custom Self Adhesive Labels'
]);

function doGet() {
  return resultPage_('Service active', 'The Sai Paper Product enquiry service is running.', true, '');
}

function doPost(e) {
  const p = (e && e.parameter) || {};
  const requestId = String(p.request_id || '').replace(/[^A-Za-z0-9_-]/g, '').slice(0, 100);
  try {
    if (String(p.website_check || p.company_website || '').trim()) {
      return resultPage_('Thank you', 'Your request was received.', true, requestId);
    }
    const name = clean_(p.name, 90);
    const mobile = mobile_(p.mobile);
    const city = clean_(p.city, 100);
    const email = clean_(p.email, 140).toLowerCase();
    const product = clean_(p.product, 100);
    const quantity = clean_(p.quantity, 70);
    const requirements = clean_(p.requirements || p.message, 500);
    const type = p.enquiry_type === 'purchase' ? 'Purchase' : 'Price';

    if (name.length < 2 || !mobile || city.length < 2) {
      return resultPage_('Check your details', 'Please provide a name, valid 10-digit mobile number and city.', false, requestId);
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return resultPage_('Invalid email', 'Please enter a valid email address.', false, requestId);
    }
    if (PRODUCTS.indexOf(product) === -1) {
      return resultPage_('Invalid product', 'Please choose a product from the Sai Paper Product catalogue.', false, requestId);
    }

    // Reserve the enquiry quickly. Do not hold a global lock while Gmail accepts
    // the message: that would serialize unrelated customers and make them wait.
    const cache = CacheService.getScriptCache();
    const digest = Utilities.computeDigest(
      Utilities.DigestAlgorithm.SHA_256, mobile + '|' + product + '|' + type
    );
    const key = 'sai_' + Utilities.base64EncodeWebSafe(digest).replace(/=+$/, '');
    const lock = LockService.getScriptLock();
    if (!lock.tryLock(4000)) {
      return resultPage_('Service busy', 'We could not start this enquiry yet. Please try again in a moment.', false, requestId);
    }
    try {
      const state = cache.get(key);
      if (state === 'sent') {
        return resultPage_('Already submitted', 'A similar enquiry was sent recently. Please do not send it again.', true, requestId);
      }
      if (state === 'processing') {
        return resultPage_('Request processing', 'A similar enquiry is already being processed. Please do not send it again.', null, requestId);
      }
      cache.put(key, 'processing', 180);
    } finally {
      lock.releaseLock();
    }

    try {
      const time = Utilities.formatDate(new Date(), CONFIG.timeZone, 'dd MMM yyyy, hh:mm a');
      const ref = 'SP-' + Utilities.formatDate(new Date(), CONFIG.timeZone, 'yyyyMMdd-HHmmss');
      const fields = [
        ['Enquiry Reference', ref],
        ['Enquiry Type', type === 'Price' ? 'Check Price / Request Quote' : 'Buy Product / Purchase Enquiry'],
        ['Product', product],
        ['Customer Name', name],
        ['Mobile', '+91 ' + mobile],
        ['Email', email || 'Not provided'],
        ['City', city],
        ['Quantity', quantity || 'Not specified'],
        ['Requirements', requirements || 'None'],
        ['Received (IST)', time]
      ];
      const rows = fields.map((row, i) =>
        '<tr style="background:' + (i % 2 ? '#ffffff' : '#f3f5f8') + '">' +
        '<th style="padding:12px;border:1px solid #dfe3e9;text-align:left;width:36%">' +
        escape_(row[0]) + '</th><td style="padding:12px;border:1px solid #dfe3e9">' +
        escape_(row[1]) + '</td></tr>'
      ).join('');
      const html = '<div style="max-width:680px;margin:auto;font-family:Arial,sans-serif;color:#1b1d2d">' +
        '<header style="background:#1b1d2d;color:white;padding:24px">' +
        '<h2 style="margin:0">SAI PAPER PRODUCT</h2><p style="color:#ff9b9d">New ' + type + ' Enquiry</p></header>' +
        '<p style="padding:14px 0">A customer submitted a website enquiry.</p>' +
        '<table style="border-collapse:collapse;width:100%;font-size:14px">' + rows + '</table>' +
        '<p style="color:#6c707e;font-size:12px;margin-top:24px">Automated enquiry from www.saipaper.in</p></div>';

      const options = {
        to: CONFIG.to,
        subject: 'Sai Papers | ' + type + ' Enquiry - ' + product,
        body: 'New website enquiry:\n\n' + fields.map(row => row[0] + ': ' + row[1]).join('\n'),
        htmlBody: html,
        name: 'Sai Paper Product Website'
      };
      if (email) options.replyTo = email;
      MailApp.sendEmail(options);
    } catch (sendError) {
      // The send operation did not complete successfully; clear the temporary reservation.
      try { cache.remove(key); } catch (cacheError) { console.error(cacheError); }
      throw sendError;
    }
    // MailApp has accepted the message. Never mark the submission failed just
    // because the noncritical duplicate-prevention cache has an outage.
    try { cache.put(key, 'sent', 180); } catch (cacheError) { console.error(cacheError); }
    return resultPage_('Enquiry submitted', 'Thank you, ' + name + '. Your ' +
      type.toLowerCase() + ' enquiry for ' + product + ' has been submitted.', true, requestId);
  } catch (err) {
    console.error('Sai Paper Product enquiry error: ' + err);
    return resultPage_('Unable to submit', 'Your enquiry could not be sent. Please try again or contact us on WhatsApp.', false, requestId);
  }
}
function clean_(value, max) {
  return String(value == null ? '' : value).replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max);
}
function mobile_(value) {
  let digits = String(value == null ? '' : value).replace(/\D/g, '');
  if (digits.length === 12 && digits.slice(0, 2) === '91') digits = digits.slice(2);
  return /^[6-9]\d{9}$/.test(digits) ? digits : '';
}
function escape_(value) {
  return String(value).replace(/[&<>"']/g, c =>
    ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
}
function resultPage_(heading, message, ok, requestId) {
  const accent = ok === true ? '#19704c' : ok === null ? '#243553' : '#ca080d';
  let html = '<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head>' +
    '<body style="background:#f5f6f8;font-family:Arial,sans-serif;color:#1b1d2d">' +
    '<main style="max-width:470px;margin:12vh auto;padding:32px;background:#fff;border-radius:12px">' +
    '<b style="color:#ca080d">SAI PAPER PRODUCT</b>' +
    '<h1 style="font-size:25px;color:' + accent + '">' + escape_(heading) + '</h1>' +
    '<p style="line-height:1.7">' + escape_(message) + '</p>' +
    '<a href="' + CONFIG.website + '" style="display:inline-block;padding:13px 18px;background:#ca080d;color:#fff;text-decoration:none;border-radius:5px">Back to website</a>' +
    '<p><a href="' + CONFIG.whatsapp + '">Contact on WhatsApp</a></p></main></body></html>';
  if (requestId) {
    const status = {
      type: 'SAI_PAPERS_ENQUIRY_RESULT',
      request_id: requestId,
      ok: ok === true,
      status: ok === null ? 'processing' : (ok === true ? 'sent' : 'failed'),
      title: heading,
      message: message
    };
    // HtmlService runs scripts inside its own sandboxed frame; the top-level
    // page is our domain. Its JS checks both origin and matching request ID.
    const serialized = JSON.stringify(status).replace(/</g, '\\u003c');
    // HTML Service may nest the response in multiple Google-owned iframes.
    // Send a few lightweight notifications so the website can acknowledge
    // promptly even when the first message races iframe initialization.
    const signal = '<script>(function(){var packet=' + serialized + ';var origin=' +
      JSON.stringify(CONFIG.website) + ';function notify(){try{window.top.postMessage(packet,origin);}catch(e){}' +
      'try{window.parent.postMessage(packet,origin);}catch(e){}}notify();' +
      'document.addEventListener("DOMContentLoaded",notify,{once:true});' +
      'window.addEventListener("load",notify,{once:true});' +
      'setTimeout(notify,250);setTimeout(notify,900);})();</script>';
    html = html.replace('</body></html>', signal + '</body></html>');
  }
  return HtmlService.createHtmlOutput(html)
    .setTitle(heading + ' | Sai Papers')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}