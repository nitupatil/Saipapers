# Security guidance — Sai Paper Product

This is a public static marketing website. Never store private credentials, API secrets, customer enquiries, backup archives or production environment files in this repository.

- The Google Apps Script deployment URL in the enquiry form is a public submission endpoint, **not a secret**. Validate inputs, enforce idempotency on request_id and add abuse protection in the Apps Script itself; browser-side controls alone are not security controls.
- Do not put Gmail credentials, OAuth client secrets, private API keys, Apps Script deployment source secrets, spreadsheets, or customer contact lists in the client-side HTML/JS.
- GitHub Pages cannot protect accidentally published files by adding them to .gitignore after they have already been committed. Audit Git history and rotate exposed credentials if any are found.
- Use GitHub secret scanning and dependency security alerts where available.
- Validate the deployed website and Google Apps Script from real browsers before treating an enquiry as confirmed. The UI should only claim receipt when the endpoint returns the matching request_id acknowledgement.
- If hosting changes away from GitHub Pages, configure HTTPS, HSTS, CSP, rate limiting and appropriate caching headers at the host.

Report suspected vulnerabilities privately to the repository owner. Do not publish exploit details or credentials in issues.
