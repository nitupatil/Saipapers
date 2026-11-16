/* Printed Barcode Labels — lightweight, dependency-free, keyboard-accessible gallery. */
(() => {
  "use strict";
  const gallery = document.getElementById("printed-gallery");
  if (!gallery) return;
  const thumbs = Array.from(gallery.querySelectorAll("[data-printed-thumb]"));
  const main = document.getElementById("printed-gallery-main");
  const title = document.getElementById("printed-gallery-title");
  const description = document.getElementById("printed-gallery-description");
  const count = document.getElementById("printed-gallery-count");
  const dialog = document.getElementById("printed-gallery-modal");
  const enlarged = document.getElementById("printed-gallery-enlarged");
  const dialogCaption = document.getElementById("printed-gallery-modal-caption");
  if (!thumbs.length || !main || !title || !description || !count) return;
  let index = 0;
  function show(nextIndex) {
    index = (nextIndex + thumbs.length) % thumbs.length;
    const selected = thumbs[index];
    main.src = selected.dataset.image;
    main.alt = selected.dataset.alt || selected.dataset.title || "Printed barcode label example";
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
  gallery.querySelector("[data-printed-prev]")?.addEventListener("click", () => show(index - 1));
  gallery.querySelector("[data-printed-next]")?.addEventListener("click", () => show(index + 1));
  gallery.querySelector("[data-printed-enlarge]")?.addEventListener("click", () => {
    if (!dialog || typeof dialog.showModal !== "function" || !enlarged) return;
    enlarged.src = main.currentSrc || main.src;
    enlarged.alt = main.alt;
    if (dialogCaption) dialogCaption.textContent = title.textContent;
    dialog.showModal();
  });
  gallery.querySelector("[data-printed-close]")?.addEventListener("click", () => dialog?.close());
  dialog?.addEventListener("click", e => { if (e.target === dialog) dialog.close(); });
  gallery.addEventListener("keydown", e => {
    if (dialog?.open || !["ArrowLeft", "ArrowRight"].includes(e.key)) return;
    if (!gallery.contains(document.activeElement)) return;
    e.preventDefault();
    show(index + (e.key === "ArrowRight" ? 1 : -1));
  });
  show(0);
})();
