# Sai Paper Product Website

Live domain: https://www.saipaper.in/  
Source repository: https://github.com/nitupatil/Saipapers

## Pages
- Home: `index.html`
- Shop / searchable product catalogue: `shop.html`
- Eleven SEO-readable product detail pages: `products/*.html`
- Industries, About, Contact and Privacy pages
- Helpful buying guides: `guides/*.html`
- `robots.txt` and `sitemap.xml`

## Assets and performance
- `assets/logo.svg`: lightweight brand logo.
- `assets/images/*.webp`: compressed 640px illustrative marketing artwork.
- `assets/css/style.css`: responsive styling with reduced-motion support.
- `assets/js/main.js`: mobile navigation, product search/filter, enquiry dialog and scroll effects.
- No build process or database required.

**Image note:** Product visuals are AI-generated promotional illustrations, not verified photos of actual stock. Check text, barcodes, specifications and equipment models before presenting them as factual photos.

## Enquiries
The site uses a normal HTML form POST to the Google Apps Script URL provided by the business.
- Form submits name, mobile, city, selected product and optional email/quantity/message.
- Form submission opens a new tab to show the Apps Script success/failure page. The website does **not** claim submission success before it is confirmed there.
- Recipient configured in the separate Apps Script deployment: `saipaper25@gmail.com`.
- Apps Script must be deployed as a Web App with Execute as: Me; Who has access: Anyone.
- Forms must be tested after deployment; GitHub Pages cannot verify delivery on its own.
- Google Apps Script sending limits and spam/abuse controls apply. Consider a stronger CAPTCHA or server-side rate limiting if spam becomes a problem.

## Publishing
- GitHub Pages: Settings → Pages → Deploy from branch `main` / `(root)`.
- Custom-domain file: `CNAME` = `www.saipaper.in`.
- Point the `www` DNS CNAME at `nitupatil.github.io`.
- Enable Enforce HTTPS after domain verification.
- Submit `https://www.saipaper.in/sitemap.xml` to Google Search Console.

## Business contact
Sai Paper Product — Baliram Gadekar
- Primary: +91 9834934303
- Secondary: +91 8390266281
- Email: saipaper25@gmail.com
- Plot No. X-12, Five Star MIDC, Shendra, Chhatrapati Sambhajinagar, Maharashtra 431007.

## Content review
Product descriptions and typical specifications are adapted from the business-supplied document. Confirm all model-specific values, compatibility claims, operating capabilities and regulatory requirements before commercial publication. Prices and reviews have deliberately not been invented.

## November 12 design update

- Header product search with immediate local suggestions, mobile-friendly layout and keyboard navigation.
- Eleven responsive 16:9 SVG promotional banners in `assets/banners/`; the carousel includes autoplay, swipe, arrows, dots and pause.
- Colored feature blocks with restrained animations and clearer bordered product cards.
- HTML product listings remain fully crawlable with unique pages; Shop page also exposes an `ItemList` schema.
- The forms now submit inside a hidden iframe and show **Submitting…** on the page. For true **Enquiry submitted** confirmation, upgrade the separately hosted Google Apps Script to `integrations/SaiPapers_WebApp_v2.gs` via **Manage deployments → Edit → New version**.
- See `integrations/README.md` for the exact script update and testing steps. An unchanged Google Apps Script deployment cannot send a trustworthy in-page acknowledgement.
