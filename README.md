# DEVELOPER.exe — GDG Assiut Edition

A bilingual, mobile-first cyberpunk developer personality experience. Visitors answer six quick questions, unlock one of six developer classes, download a shareable identity card, and explore local session statistics.

## Features

- English / Arabic language switch with automatic LTR / RTL layout.
- Six-question personality quiz and six developer identities.
- Downloadable PNG identity card generated with the browser Canvas API.
- Native social sharing on supported phones, with clipboard fallback.
- Developer Multiverse statistics stored locally in the visitor's browser.
- Responsive layout for phones, tablets, and desktops.
- No account, names, tracking, or backend required.

## Run locally

Open `index.html` in a modern browser, or run `python -m http.server 8000` and visit `http://localhost:8000`.

## Publish on GitHub Pages

1. Open **Settings → Pages** in this repository.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select branch `main` and folder `/ (root)`, then save.
4. Wait for GitHub Pages to publish at `https://AbdoOraby21.github.io/DEVELOPER.exe/`.

## Multiverse statistics

GitHub Pages is static hosting, so quiz counts are stored in `localStorage` on the current browser/device. They are not aggregated across visitors. For shared event-wide statistics, connect a backend such as Firebase or Supabase.

## Files

- `index.html` — page structure and metadata.
- `styles.css` — cyberpunk visual design and responsive layout.
- `app.js` — quiz logic, translations, result cards, sharing, and local statistics.
- `.nojekyll` — GitHub Pages configuration marker.

## Privacy

The app does not request personal information, use analytics, or transmit quiz answers. Anonymous class counts remain in the current browser's local storage. Google Fonts are loaded from Google Fonts.
