/* Shipping Labels — lightweight, dependency-free, keyboard-accessible gallery. */
(() => {
  "use strict";
  const gallery = document.getElementById("shipping-gallery");
  if (!gallery) return;
  const thumbs = Array.from(gallery.querySelectorAll("[data-shipping-thumb]"));
  const main = document.getElementById("shipping-gallery-main");
  const title = document.getElementById("shipping-gallery-title");
  const description = document.getElementById("shipping-gallery-description");
  const count = document.getElementById("shipping-gallery-count");
  const dialog = document.getElementById("shipping-gallery-modal");
  const enlarged = document.getElementById("shipping-gallery-enlarged");
  const dialogCaption = document.getElementById("shipping-gallery-modal-caption");
  if (!thumbs.length || !main || !title || !description || !count) return;
  let index = 0;
  function show(nextIndex) {
    index = (nextIndex + thumbs.length) % thumbs.length;
    const selected = thumbs[index];
    main.src = selected.dataset.image;
    main.alt = selected.dataset.alt || selected.dataset.title || "Shipping label example";
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
  gallery.querySelector("[data-shipping-prev]")?.addEventListener("click", () => show(index - 1));
  gallery.querySelector("[data-shipping-next]")?.addEventListener("click", () => show(index + 1));
  gallery.querySelector("[data-shipping-enlarge]")?.addEventListener("click", () => {
    if (!dialog || typeof dialog.showModal !== "function" || !enlarged) return;
    enlarged.src = main.currentSrc || main.src;
    enlarged.alt = main.alt;
    if (dialogCaption) dialogCaption.textContent = title.textContent;
    dialog.showModal();
  });
  gallery.querySelector("[data-shipping-close]")?.addEventListener("click", () => dialog?.close());
  dialog?.addEventListener("click", e => { if (e.target === dialog) dialog.close(); });
  gallery.addEventListener("keydown", e => {
    if (dialog?.open || !["ArrowLeft", "ArrowRight"].includes(e.key)) return;
    if (!gallery.contains(document.activeElement)) return;
    e.preventDefault();
    show(index + (e.key === "ArrowRight" ? 1 : -1));
  });
  show(0);
})();
