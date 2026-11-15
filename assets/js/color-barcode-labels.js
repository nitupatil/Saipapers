/* Color Barcode Labels — lightweight, dependency-free, keyboard-accessible gallery. */
(() => {
  "use strict";
  const gallery = document.getElementById("color-gallery");
  if (!gallery) return;
  const thumbs = Array.from(gallery.querySelectorAll("[data-color-thumb]"));
  const main = document.getElementById("color-gallery-main");
  const title = document.getElementById("color-gallery-title");
  const description = document.getElementById("color-gallery-description");
  const count = document.getElementById("color-gallery-count");
  const dialog = document.getElementById("color-gallery-modal");
  const enlarged = document.getElementById("color-gallery-enlarged");
  const dialogCaption = document.getElementById("color-gallery-modal-caption");
  if (!thumbs.length || !main || !title || !description || !count) return;
  let index = 0;
  function show(nextIndex) {
    index = (nextIndex + thumbs.length) % thumbs.length;
    const selected = thumbs[index];
    main.src = selected.dataset.image;
    main.alt = selected.dataset.alt || selected.dataset.title || "Color barcode label example";
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
  gallery.querySelector("[data-color-prev]")?.addEventListener("click", () => show(index - 1));
  gallery.querySelector("[data-color-next]")?.addEventListener("click", () => show(index + 1));
  gallery.querySelector("[data-color-enlarge]")?.addEventListener("click", () => {
    if (!dialog || typeof dialog.showModal !== "function" || !enlarged) return;
    enlarged.src = main.currentSrc || main.src;
    enlarged.alt = main.alt;
    if (dialogCaption) dialogCaption.textContent = title.textContent;
    dialog.showModal();
  });
  gallery.querySelector("[data-color-close]")?.addEventListener("click", () => dialog?.close());
  dialog?.addEventListener("click", e => { if (e.target === dialog) dialog.close(); });
  gallery.addEventListener("keydown", e => {
    if (dialog?.open || !["ArrowLeft", "ArrowRight"].includes(e.key)) return;
    if (!gallery.contains(document.activeElement)) return;
    e.preventDefault();
    show(index + (e.key === "ArrowRight" ? 1 : -1));
  });
  show(0);
})();
