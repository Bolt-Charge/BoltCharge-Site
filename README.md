# BoltCharge website

Static HTML, CSS, and JavaScript. No frameworks, install, or build required. The first load defaults to Holo Light; the switch toggles Solar Flare and remembers the choice.

## Local development

From the folder containing `index.html`, run `python -m http.server 8000` (or `py -m http.server 8000` on Windows), then open `http://localhost:8000`. Opening `index.html` directly also works; for `file://` URLs, form submissions use Formspree's native POST/confirmation page rather than inline feedback.

## Deploy on Vercel

Upload or connect the project with **Framework Preset: Other**, **Root Directory: repository root**, **Build Command: empty**, and **Output Directory: `.`** if prompted. Your `index.html`, `style.css`, `script.js`, and `assets/` must be served from the same directory. No environment variables are required for the current implementation.

## Forms

Both the waitlist and contact forms submit directly to the existing Formspree endpoint `https://formspree.io/f/xbgdbjod` and work from localhost or a published URL. The waitlist sends `submission_type=waitlist`, email, interest, and consent; the contact form sends `submission_type=contact`, name, email, and message. Submissions must be confirmed in the Formspree dashboard and account's verified destination inbox. If this endpoint is owned by a different account or inactive, replace it in both `index.html` form `action` attributes and the form `action` attributes in `index.html` (JavaScript reads them directly).

Valid input is required. Forms show pending/success/error states; duplicate clicks while a submission is in flight are ignored, and failed submissions retain the entered data. Without JavaScript the forms fall back to a normal Formspree page. A successful Formspree request is not an automatic marketing mailing list or proof that a launch email has been delivered: manage opt-in, export, unsubscribe requests, retention, and email campaigns from your provider as appropriate.

## Before collecting real signups

Review the public waitlist privacy copy for your actual policy and ensure your inbox is verified with Formspree. Submit one signup and one contact inquiry, then check they appear in Formspree under the correct `submission_type` and that emails go to the intended inbox. You can configure a separate Formspree form for each in the future if you prefer separate queues.

## If the contact form still says "Validate message"

This ZIP already has a working "Send message" form. After applying this new patch, the button will say **Send inquiry**. If the browser still shows "Validate message", it is serving a different or stale `index.html`, not the one from this ZIP. From the folder containing your real project files, run `Select-String -Path .\index.html -Pattern 'Send inquiry|Validate message'` in PowerShell. Restart the local server from that same folder and hard-reload the page (`Ctrl+Shift+R`). Do not apply a patch to a different copy of the project.

## Verification

Run `node --check script.js` to check syntax. The app also supports native HTML required/email validation, reduced motion, keyboard nav, and mobile navigation. The previously present sample statistics, fictional testimonials, team placeholders, and demo-only contact form have been removed.
