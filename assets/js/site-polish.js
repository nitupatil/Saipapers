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

  // A visible short set of application cards; the rest remain available on demand.
  // Without JS the original full card collection remains visible.
  document.querySelectorAll('.detail-wrap [class$="-use-gallery"]').forEach((gallery, galleryIndex) => {
    const cards = Array.from(gallery.children).filter(node => node.matches('article, div'));
    if (cards.length <= 4 || gallery.nextElementSibling?.classList.contains("sp-expand")) return;
    if (!gallery.id) gallery.id = "sp-use-gallery-" + (galleryIndex + 1);
    const showCount = 4;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "sp-expand";
    button.setAttribute("aria-controls", gallery.id);
    let expanded = false;
    function setExpanded(next) {
      expanded = next;
      cards.forEach((card, index) => {
        if (index >= showCount) card.hidden = !expanded;
      });
      button.setAttribute("aria-expanded", String(expanded));
      button.textContent = expanded ? "Show fewer examples" : "View all " + cards.length + " examples";
    }
    button.addEventListener("click", () => setExpanded(!expanded));
    gallery.insertAdjacentElement("afterend", button);
    setExpanded(false);
  });

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
