# Sai Paper Product — Google Apps Script enquiry service (v3)

The website is served by GitHub Pages. Enquiry emails are sent by an **independently deployed** Google Apps Script Web App. A GitHub commit alone **cannot update the live Apps Script**.

- Website: https://www.saipaper.in/
- Existing endpoint: https://script.google.com/macros/s/AKfycbzCoQbymaTksWBM8rmDdp_G4FTQWejpn15hqGmML-OeSJfj-ityDWhC3DkRdf7IXtyX/exec
- **New source to deploy:** [SaiPapers_WebApp_v3.gs](SaiPapers_WebApp_v3.gs)
- Previous working version (rollback): [SaiPapers_WebApp_v2.gs](SaiPapers_WebApp_v2.gs)

## Required deployment in your existing Google Apps Script project

1. Open the **existing** Apps Script project behind the website's `/exec` URL.
2. Select `Code.gs`. Copy **all code** from `SaiPapers_WebApp_v3.gs` and replace the old code.
3. Click **Save**.
4. Click **Deploy → Manage deployments → Edit (pencil)** for the *existing* Web App.
5. Choose **New version**, then click **Deploy**. Do **not** create a new deployment URL.
6. Confirm the deployment settings: **Execute as: Me**; **Who has access: Anyone**.
7. Authorize the Mail service if prompted. Keep the recipient as `saipaper25@gmail.com`.
8. Open https://www.saipaper.in/contact on mobile and desktop, refresh once, submit **one** test enquiry and check both the on-screen result and the actual email.
9. In Apps Script → **Executions**, confirm the matching `doPost` execution completed without error.

## What changed

**Website UI (deployed with GitHub Pages):**
- Immediately shows a full-screen animated branded overlay on a valid form submission, blocking clicks and extra submissions.
- Keeps the screen protected while waiting for the Google Apps Script result. At 12 seconds it displays a slower-processing message.
- Uses one-time request IDs and a three-minute per-tab safeguard against resubmitting the same product/phone-number suffix.
- Waits up to **45 seconds** for the success/failure acknowledgement. When no acknowledgement arrives, it does **not** falsely claim the email was rejected or definitely delivered. It displays a neutral *confirmation pending* message and advises against resending.
- The submission overlay automatically closes when Google provides a valid result (or when the 45-second uncertainty limit is reached).
- The processing animation uses local CSS/SVG only: **no remote GIF, animation library or extra network download**.

**Google Apps Script v3 (requires the manual deployment above):**
- Reserves a request in the two-minute/three-minute short-term cache while holding the script lock briefly, **releasing the lock before** `MailApp.sendEmail`. This avoids holding other customer requests behind one slow email.
- Removes the extra daily-quota service call before sending (Google's mail service will report an actual quota failure).
- Separates `processing`, `sent`, and `failed` acknowledgements, and retries the iframe `postMessage` signal briefly to reduce missed browser notifications.
- Returns positive confirmation **only after** `MailApp.sendEmail` finishes without throwing.
- Retains all submitted fields, validation, honeypot handling, email formatting and configured recipient.

The `MailApp.sendEmail` call is still subject to Google availability, service latency and delivery time. Neither GitHub Pages nor browser JavaScript can guarantee immediate inbox delivery. The CSS overlay affects **user interaction**, not actual network or mail latency.

## Troubleshooting

- **Email arrives but website shows “Confirmation pending”:** Most commonly, the deployed Apps Script is an older version or the browser blocked its nested-iframe acknowledgement. Verify that the **existing Web App was redeployed as New version**. Open Apps Script → Executions and check the result. Do not resend immediately.
- **Overlay doesn't appear:** Hard refresh the website to load the latest versioned `main.js` and `site-polish.css`.
- **No email:** Check Apps Script execution logs, sender authorization, quota and Gmail spam folder.
- **Request processing / already sent:** Another very similar enquiry is in progress or was recently accepted. Wait; do not try repeatedly.
- **Browser blocks third-party iframes:** The email may still be sent, but same-page confirmation could remain unavailable. Try a browser without strict iframe blocking or contact your team via WhatsApp instead.
- **Unchanged `/exec` URL:** Keep the same deployment endpoint to avoid updating every HTML form.
- **Rollback:** Paste `SaiPapers_WebApp_v2.gs` into the Apps Script editor, then deploy a new version of the existing Web App.

## Safety and data protection

The public site uses a hidden form POST to Google's Web App URL. The browser accepts result messages only from Google Apps Script/Googleusercontent origins with a matching one-time request ID. The short-term cache reduces accidental duplicates, but is not a transactional database or CAPTCHA. It cannot prove final Gmail inbox delivery; it verifies only Google MailApp's successful acceptance. Do not store private API secrets in public GitHub files.
