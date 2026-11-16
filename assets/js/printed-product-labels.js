/* Printed Product Labels — lightweight, dependency-free, keyboard-accessible gallery. */
(() => {
  "use strict";
  const gallery = document.getElementById("product-labels-gallery");
  if (!gallery) return;
  const thumbs = Array.from(gallery.querySelectorAll("[data-product-labels-thumb]"));
  const main = document.getElementById("product-labels-gallery-main");
  const title = document.getElementById("product-labels-gallery-title");
  const description = document.getElementById("product-labels-gallery-description");
  const count = document.getElementById("product-labels-gallery-count");
  const dialog = document.getElementById("product-labels-gallery-modal");
  const enlarged = document.getElementById("product-labels-gallery-enlarged");
  const dialogCaption = document.getElementById("product-labels-gallery-modal-caption");
  if (!thumbs.length || !main || !title || !description || !count) return;
  let index = 0;
  function show(nextIndex) {
    index = (nextIndex + thumbs.length) % thumbs.length;
    const selected = thumbs[index];
    main.src = selected.dataset.image;
    main.alt = selected.dataset.alt || selected.dataset.title || "Printed product label example";
    title.textContent = selected.dataset.title || "Product view";
    description.textContent = selected.dataset.description || "";
    count.textContent = String(index + 1) + " / " + thumbs.length;
    thumbs.forEach((item, i) => {
      item.classList.toggle("is-selected", i === index);
      item.setAttribute("aria-pressed", String(i === index));
    });
    if (dialog && dialog.open && enlarged) {
      enlarged.src = main.currentSrc || main.src;
      enlarged.alt = main.alt;
      if (dialogCaption) dialogCaption.textContent = title.textContent;
    }
  }
  thumbs.forEach((item, i) => item.addEventListener("click", () => show(i)));
  gallery.querySelector("[data-product-labels-prev]")?.addEventListener("click", () => show(index - 1));
  gallery.querySelector("[data-product-labels-next]")?.addEventListener("click", () => show(index + 1));
  gallery.querySelector("[data-product-labels-enlarge]")?.addEventListener("click", () => {
    if (!dialog || typeof dialog.showModal !== "function" || !enlarged) return;
    enlarged.src = main.currentSrc || main.src;
    enlarged.alt = main.alt;
    if (dialogCaption) dialogCaption.textContent = title.textContent;
    dialog.showModal();
  });
  gallery.querySelector("[data-product-labels-close]")?.addEventListener("click", () => dialog?.close());
  dialog?.addEventListener("click", e => { if (e.target === dialog) dialog.close(); });
  gallery.addEventListener("keydown", e => {
    if (dialog?.open || !["ArrowLeft", "ArrowRight"].includes(e.key)) return;
    if (!gallery.contains(document.activeElement)) return;
    e.preventDefault();
    show(index + (e.key === "ArrowRight" ? 1 : -1));
  });
  show(0);
})();
