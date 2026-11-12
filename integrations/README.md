# Google Apps Script — same-page enquiry confirmation

Website: https://www.saipaper.in/
Existing web app endpoint: https://script.google.com/macros/s/AKfycbzCoQbymaTksWBM8rmDdp_G4FTQWejpn15hqGmML-OeSJfj-ityDWhC3DkRdf7IXtyX/exec

## Required one-time action

The website is on GitHub Pages, but your email-sending Google Apps Script runs in a separate Google account. Updating GitHub **does not redeploy the script**. The current script will keep showing its standalone result page unless you install v2.

1. Open your existing Google Apps Script project (do **not** create a new project).
2. Open `Code.gs`. Copy everything from [SaiPapers_WebApp_v2.gs](SaiPapers_WebApp_v2.gs), replacing the previous code.
3. Save.
4. Choose **Deploy → Manage deployments**.
5. Find your existing Web app deployment, click the **pencil/Edit** icon.
6. Set the **Version** dropdown to **New version**, then click **Deploy**.
7. Confirm the **/exec URL is unchanged**. The website already uses this exact URL.
8. Open www.saipaper.in, choose a product, click **Ask Price**, enter a real test number and submit.
9. The website button should show **Submitting…**, then a green **Enquiry submitted** result on the same page after Google Apps Script acknowledges the email request.
10. Verify the mail with an HTML details table arrives at `saipaper25@gmail.com` (also check spam).

## How it works

- GitHub Pages submits an HTML POST to a hidden iframe with the Apps Script `/exec` URL.
- Apps Script validates name, mobile, city, product and optional fields; sends email using `MailApp.sendEmail`; then sends `window.top.postMessage` to https://www.saipaper.in with a matching one-time request ID.
- The website accepts the acknowledgement only from Google's Apps Script/Googleusercontent origin with the matching request ID. It only reports **submitted** when the server says it succeeded.
- If the server does not acknowledge within 30 seconds, the website shows **confirmation unavailable** rather than falsely claiming email delivery.
- `HtmlService.XFrameOptionsMode.ALLOWALL` allows the hidden iframe response to render. The only status message target origin is the exact Sai Paper Product website domain.
- A two-minute duplicate check and an invisible honeypot help reduce accidental repeat messages. They are not robust CAPTCHA protection. For high traffic, add a proper managed anti-bot or server-side limit service.

## Troubleshooting

- **Still waiting to confirm**: Usually the v2 Apps Script code was saved but the Web App was not redeployed as a new version, or the iframe is blocked by browser settings. Edit the existing deployment again.
- **No email**: Verify authorization, Google daily sending quota and the configured recipient address, then inspect **Executions** in Apps Script.
- **Form goes to a new tab**: Refresh the site (or hard reload) to load the latest `assets/js/main.js`.
- **Same product enquiry already submitted**: Wait more than two minutes before trying again.

**Privacy and security:** Do not use a personal secret/API token in public HTML. The endpoint is public and can receive spam. No client-side code can securely verify private Gmail delivery; the app only confirms that the authorized script successfully called `MailApp.sendEmail`.
