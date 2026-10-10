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

## Product refinement v2 — 2026-10-10

- Rebuilt the bottle profile from the supplied close-up: slender body, long smooth shoulder, dark green glass, rolled burgundy capsule and continuous warm paper wrap. Studio reflections and soft physical shadows are shared by the hero and catalog.
- Rebuilt oak cases with bevelled planks, end grain, hinged lid, hardware, partitions, and twelve full bottle models in two layers. Magnum and half formats have separate proportions and GLB exports.
- Improved the stemmed glass model, botanical estate seal, organic fluid marks and capillary glass ring. The existing generated glass photograph remains the website asset.
- Five transparent catalog renders are now 1296 × 1512 RGBA WebP; their PNG originals are preserved under design/assets.
- Production build passed: app 15.85 KB, motion 114.01 KB and Three.js 485.47 KB before compression.
- Verification passed: all referenced assets and anchors, five products, six GLB files, label/body clearance, and twelve-bottle case count.
- Production preview visually checked at 1280 × 900 and 390 × 844. No horizontal overflow or broken visible images; browser error log empty. The magnum button selects the matching format in the reservation dialog.
- Hero fallback now uses the same product image instead of an older simplified SVG. Actual GPU-disable testing remains unverified.
- Evidence: output/qa/v2-desktop-hero.png, v2-desktop-products.png, v2-mobile-hero.png, v2-mobile-products.png.

## Reference correction v3 — 2026-10-10

- Reference geometry and character composition were measured from the user's screenshot; see docs/refinement-v3.md. Procedural bottle width/height changed from approximately 0.202 to 0.242. Capsule, low shoulder curve, heel and case spacing were corrected.
- Three new generated assets were inspected: the winemaker scene, burgundy bottle and gold capsule variant. Two bottle PNGs contain real RGBA transparency; alpha bounds were checked before their UV crop was applied.
- Main bottle and catalog bottles use reference-guided photographic plates; procedural meshes supply shadows and editable GLB assets. This implementation is explicitly documented as hybrid rather than a fully volumetric reproduction.
- Photo/copy/title positioning, logo scale, wine/paper colors, ink wear and scrollbar treatment were corrected. Direct #character navigation restores the correct position after font layout.
- Final build passed: application 17.09 KB, motion 114.01 KB, Three.js 488.48 KB before compression. Asset/anchor/model checks passed, including label clearance and case count; syntax and git diff whitespace checks passed.
- Browser checked at 1218 × 716 and 390 × 844; no horizontal overflow or broken visible images. Direct character URL opens with heading top approximately 195px. Magnum selection opens its correct dialog format. Browser error log was empty in the observed run.
- Proof: output/qa/v3-character.png, v3-mobile-hero.png and v3-mobile-products.png. The production preview serves /assets/index-1dDQ9QKo.js.
- The original-template assets and typeface remain unavailable; exact pixel identity and measured Lighthouse results are not claimed. Original photos and prior source ZIPs are preserved.
