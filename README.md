# Donut Draws — Portfolio

A lightweight, responsive portfolio website for Ajay / Donut Draws.

## Structure
- `index.html` — homepage
- `work.html` — portfolio gallery + filters
- `about.html` — bio and skills
- `contact.html` — contact page
- `styles.css` — all styling
- `script.js` — mobile menu, filters and reveal animation
- `assets/art/` — put your artwork here

## Replace the placeholders
The colored boxes currently say things like `PROJECT 01`. Replace them with your actual artwork.

The easiest approach:
1. Put images inside `assets/art/`.
2. In the HTML, replace a placeholder like:
   `<div class="art-placeholder art-one"><span>PROJECT 01</span></div>`
   with:
   `<div class="art-image"><img src="assets/art/my-art.jpg" alt="Description of my artwork"></div>`
3. Add this to `styles.css`:
   `.art-image{border-radius:var(--radius);overflow:hidden}.art-image img{display:block;width:100%;height:100%;object-fit:cover;}`

## Branding
Working brand: **donut draws.**
Positioning: playful, personal, slightly weird, illustration-first.

Suggested palette:
- Paper: #F6F1E8
- Ink: #191817
- Coral: #E86F51
- Mustard: #F1C84B
- Muted: #716B63

Fonts:
- Space Grotesk — headings/logo
- DM Sans — body text

## Publish free with GitHub Pages
GitHub Pages can host this static HTML/CSS/JS site for free from a public repository.

1. Create a GitHub account if you don't have one.
2. Create a repository named `<your-github-username>.github.io`.
3. Upload all files in this folder to the repository.
4. Open the repository's **Settings → Pages**.
5. Choose the publishing source / branch as instructed by GitHub.
6. Your site will appear at `https://<your-github-username>.github.io/`.

For a professional custom domain later, buy a domain such as `donutdraws.com` (if available) and connect it to GitHub Pages.

## Before applying to jobs
- Replace every placeholder with real artwork.
- Put your strongest 6–12 pieces first.
- Add 2–4 process images to your best projects.
- Add a downloadable PDF resume.
- Replace the LinkedIn placeholder URL in `contact.html`.
- Test the site on your phone.
- Check every image has useful alt text.
