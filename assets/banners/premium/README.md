# Sai Paper Product — 9 optimized mobile-only homepage banners

These WebP files replace the previous mobile promotional slideshow artwork. The desktop homepage artwork, text, buttons and image cutouts are **unchanged**.

- Target display size: **1280 × 720 px (16:9)** for every image.
- Source: Sai Papers AI-generated banner illustrations from November 2026.
- Compression: high-fidelity WebP quality 98; **lossless WebP** for the Color Barcode Labels and Printed Product Labels banners to preserve saturated colors and fine edges.
- All banners visually depict their corresponding category: labels, barcodes, shipping, printers or thermal transfer ribbons.
- Combined PNG originals: approximately 15.7 MB; combined nine WebP files: approximately 2.78 MB.
- All images are for promotional illustration and may show sample barcodes, fictional package details or depicted hardware. Do not treat mockups as verified available inventory.

## Files and slideshow order

1. `chromo-barcode-labels-1280x720.webp` — Chromo Barcode Labels
2. `direct-thermal-labels-1280x720.webp` — Direct Thermal Labels
3. `shipping-labels-1280x720.webp` — Shipping Labels
4. `printed-barcode-labels-1280x720.webp` — Printed Barcode Labels
5. `color-barcode-labels-1280x720.webp` — Color Barcode Labels (lossless at output resolution)
6. `printed-product-labels-1280x720.webp` — Printed Product Labels (lossless at output resolution)
7. `barcode-printers-1280x720.webp` — Barcode Printers
8. `plain-labels-1280x720.webp` — Plain Adhesive Labels
9. `thermal-transfer-ribbons-1280x720.webp` — Thermal Transfer Ribbons (new mobile-only source)

The original banners are available in Git history if rollback is required. The site uses the same slideshow links and timing, with a cache-busting version on mobile images.

### Performance

All nine files are optimized without introducing a new JS dependency. The first mobile slide receives `fetchpriority="high"` and `loading="eager"`; later slides load lazily.
