# Validation — 2026-10-10

## Confirmed

- `npm run build`: successful, Vite 7.3.7. Split JavaScript: application 16 KB, motion 114 KB, Three.js 494 KB before compression.
- `node scripts/verify.mjs`: 17 referenced local assets, all section anchors, five products and four structurally valid GLB 2.0 models passed.
- Node syntax check of application code passed.
- Browser checks at 1440×900, 1280×754, 768×1024 and 390×844. No horizontal overflow in observed layouts.
- Navigation, chapter anchors, search filtering, Escape, pairing dialog and product selection were exercised.
- Test reservation and newsletter with synthetic values display browser-local success messages. No external mail or order is sent.
- Editorial photos, transparent wine glass, wood texture, catalog renders and main 3D bottle were visually inspected.
- Final desktop estate heading occupies two lines. Loaded final-page images have nonzero natural dimensions.
- Catalog images ship as WebP; PNG originals are outside the public directory. Supporting products no longer need another WebGL renderer at runtime.

## Evidence

- `output/qa/desktop-hero.jpg`
- `output/qa/mobile-hero.jpg`
- Additional section captures are retained in `output/qa`.

## Limits

- No measured Lighthouse or real-user Core Web Vitals result is claimed.
- Reduced-motion and WebGL-fallback paths are implemented but have not been exercised under an actual disabled GPU or operating-system reduced-motion setting.
- Exact reference assets, fonts and winemaker video were not supplied. Rebuilt assets are visually related, not identical originals.
- Commerce, email delivery and database persistence require backend integration.
