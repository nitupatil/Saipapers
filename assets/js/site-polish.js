/* Sai Papers — progressive, dependency-free UI polish.
   Presentation only: leaves product data, navigation and enquiry handlers intact. */
(() => {
  "use strict";
  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  const productPage = !!document.querySelector(".detail-wrap");

  // Interactive wave ripples: do not cancel clicks, submits, or navigation.
  if (!reducedMotion) {
    document.addEventListener("pointerdown", event => {
      if (!(event.target instanceof Element)) return;
      const target = event.target.closest(".btn, .hero-cta, .header-search-go, .sp-expand, button[data-enquire]");
      if (!target || target.disabled || event.button !== 0) return;
      const rect = target.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const size = Math.max(rect.width, rect.height) * 2.5;
      const wave = document.createElement("span");
      wave.className = "sp-wave-ripple";
      wave.setAttribute("aria-hidden", "true");
      wave.style.width = size + "px";
      wave.style.height = size + "px";
      wave.style.left = (event.clientX - rect.left - size / 2) + "px";
      wave.style.top = (event.clientY - rect.top - size / 2) + "px";
      target.appendChild(wave);
      wave.addEventListener("animationend", () => wave.remove(), { once: true });
      window.setTimeout(() => wave.remove(), 850);
    }, { passive: true });
  }

  // Streamlined quotation form without changing the Apps Script submission field names.
  const form = document.getElementById("enquiry-form");
  if (form && !form.querySelector(".sp-form-more")) {
    const details = document.createElement("details");
    details.className = "sp-form-more";
    const summary = document.createElement("summary");
    summary.textContent = "Add quantity, size or other details (optional)";
    const extra = document.createElement("div");
    extra.className = "sp-form-more-fields";
    const email = form.querySelector('input[name="email"]')?.closest(".field");
    const qty = form.querySelector('input[name="quantity"]')?.closest(".field");
    const message = form.querySelector('input[name="message"]')?.closest(".field");
    for (const field of [qty, message, email]) {
      if (field) extra.appendChild(field);
    }
    details.append(summary,extra);
    const submit = form.querySelector('button[type="submit"]');
    if (submit) form.insertBefore(details,submit);
    const description = document.querySelector(".dialog-body > p.small");
    if (description) description.textContent = "Share a few details. Our team will contact you about sizes and pricing.";
    if (submit) submit.textContent = "Request a Quote ↗";
    // When the product is already selected from a card, keep it easy to see and change.
    const phone = form.querySelector('input[name="mobile"]');
    if (phone) {phone.setAttribute("inputmode","tel");phone.setAttribute("autocomplete","tel");}
  }
  // Keep the Contact page just as concise as the quick quotation dialog.
  const contactForm = document.querySelector('.contact-form-card form[action*="script.google.com"]');
  if (contactForm && !contactForm.querySelector(".sp-form-more")) {
    const details = document.createElement("details");
    details.className = "sp-form-more";
    const summary = document.createElement("summary");
    summary.textContent = "More details (optional)";
    const extra = document.createElement("div");
    extra.className = "sp-form-more-fields";
    for (const name of ["quantity","message","email"]) {
      const field = contactForm.querySelector('[name="'+name+'"]')?.closest(".field");
      if (field) extra.appendChild(field);
    }
    details.append(summary,extra);
    const submit = contactForm.querySelector('button[type="submit"]');
    if (submit) {
      contactForm.insertBefore(details,submit);
      submit.textContent = "Request a Quote ↗";
    }
  }
  if (!productPage) return;

  // Simple vector pictograms, no third-party icon font or dependency.
  const pictograms = [
    '<path d="M4 7h16M6 4h12v16H6z"/><path d="M9 11h6M9 15h4"/>',
    '<path d="M3 7l9-4 9 4-9 4-9-4Z"/><path d="M3 7v10l9 4 9-4V7M12 11v10"/>',
    '<path d="M4 14c0-6 4-10 10-10h6v6c0 6-4 10-10 10H4v-6Z"/><path d="m7 17 9-9"/>'
  ];
  const copy = ["Specifications on enquiry", "Bulk order quotes", "Material guidance"];
  const summary = document.querySelector(".detail-copy");
  if (summary && !summary.querySelector(".sp-highlights")) {
    const container = document.createElement("div");
    container.className = "sp-highlights";
    container.setAttribute("aria-label", "Enquiry support");
    copy.forEach((label, i) => {
      const item = document.createElement("span");
      item.className = "sp-highlight";
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("viewBox", "0 0 24 24");
      svg.setAttribute("aria-hidden", "true");
      svg.innerHTML = pictograms[i];
      item.append(svg, document.createTextNode(label));
      container.appendChild(item);
    });
    const anchor = summary.querySelector(".lead") || summary.querySelector(".product-title");
    if (anchor) anchor.insertAdjacentElement("afterend", container);
  }

  // Keep every product-use example visible, on every screen.
  document.querySelectorAll(".sp-expand").forEach(button => button.remove());
  document.querySelectorAll('.detail-wrap [class$="-use-gallery"] > [hidden]').forEach(item => { item.hidden = false; });

  // Add light entrance polish, not visibility-dependent animations.
  if (!reducedMotion && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("sp-inview");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.06 });
    document.querySelectorAll(".specs-section, .detail-wrap [class$='-explore-head'], .detail-wrap [class$='-buying']").forEach(el => observer.observe(el));
  }
})();
