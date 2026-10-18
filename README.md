# BoltCharge — static company website

Tagline: **Power tomorrow. Efficiently.** A tagline is a short phrase that describes your brand's promise.

## Run locally
Extract this ZIP and open `index.html`. Keep `style.css` and `script.js` beside it.
No installation, framework, or build step is needed. Google Fonts needs internet;
system fonts are used offline. All illustrations are CSS, SVG, or canvas.

## Themes and interaction
Five complete palettes: Neon Cyber, Matrix Green, Aurora, Solar Flare, and Holo Light.
The first visit follows the system light/dark preference; subsequent visits use
the theme saved in localStorage where permitted. The pause button stops continuous
motion, and the system reduced-motion preference takes precedence.
Application filters, tilt, counters, typing, mobile navigation, and the testimonial
carousel are implemented in vanilla JavaScript. Without JavaScript, content remains
readable and submit buttons remain disabled.

## Publish on Netlify (recommended for collecting the waitlist)
1. Create a Netlify site and deploy the extracted folder containing index.html.
   A manual drag-and-drop deploy or a connected Git repository both work.
2. In the site's Forms area, enable form detection.
3. Before collecting real addresses, edit the privacy section in index.html:
   provide a working privacy contact, an actual retention period, and your
   operational policy. Confirm your form provider and unsubscribe process.
4. At the top of script.js change the configuration to:
   const WAITLIST = { provider: 'netlify', endpoint: '' };
5. Redeploy the folder. No build command is required; publish the directory
   containing index.html. If connecting Git, the publish directory can be `.`.
6. Verify that `boltcharge-waitlist` appears in Netlify Forms. Submit your own test
   email on the hosted site and confirm its arrival in Forms, including consent
   and selected interest. Check spam if it is missing. A successful HTTP response
   alone cannot prove the form was registered correctly.
7. View/export submissions from Forms. Configure submission notifications in your
   provider dashboard if desired. Check the provider's current plan limits.

The site does not automatically send launch campaigns. When you launch, export
consented subscribers into an email platform and send a launch email with an
unsubscribe link. Do not publish subscriber lists or credentials in the site.

## Publish on GitHub Pages
1. Create a GitHub repository and upload index.html, style.css, and script.js
   to the root of the main branch.
2. Open Settings > Pages. Choose Deploy from a branch, main, and /(root); save.
3. Use the URL GitHub provides after deployment finishes.
GitHub Pages hosts static files and does not collect forms by itself.
For a working waitlist there, create a Formspree form and set:
   const WAITLIST = { provider: 'formspree', endpoint: 'YOUR_PUBLIC_FORM_ENDPOINT' };
Replace the endpoint value with the real https://formspree.io/f/... URL returned
by your account. Verify the destination email and follow provider setup. Publish
the privacy details above, then test a sign-up and verify it in Formspree.

## Contact form
The contact form is deliberately front-end only. It validates name, email, and
message and clearly states that nothing was sent. The integration point is in
script.js's contact-form submit listener. Connect Formspree or EmailJS there and
only report delivery after a successful provider response. Never include private
API keys in public JavaScript.

## Before launch
- Replace demo statistics with verified company metrics or remove the block.
- Replace illustrative testimonials with authorized real quotes or remove them.
- Replace discipline cards with actual team profiles if desired.
- Confirm the proposed focus areas and concept applications match your business.
- Add your actual email, phone, location, and social profile URLs.
- Add og:url and an absolute og:image URL after you have a production domain and
  a real share image. The included Open Graph title, description, and type work
  without those optional properties.
- Add your privacy contact, retention policy, and launch email unsubscribe process.

No performance figures, certifications, customers, or actual team identities
have been invented. Demo counters and quotes are visibly identified as samples.

## Verification
JavaScript syntax, HTML IDs/fragment links, local file references, basic form
labels, and palette text contrast were checked. An interactive browser preview
was not available in the build environment. Test the finished deployment on your
phone and desktop, keyboard navigation, all themes, and a real waitlist submission.

Official setup references:
https://docs.netlify.com/manage/forms/setup/
https://docs.netlify.com/manage/forms/submissions/
https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
