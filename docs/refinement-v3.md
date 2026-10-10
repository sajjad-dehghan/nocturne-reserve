# Reference correction v3 — 2026-10-10

## Measurements

The supplied character screenshot is preserved in `design/references/character-reference.png`; the preceding close-up is in `design/references/hero-bottle-reference.png`.

- Reference frame: approximately x=53…1270, y=46…763, or 1218 × 716 pixels.
- Upright bottle: approximately 141 × 583 pixels, width/height 0.242. The preceding procedural model was approximately 0.202 and was too narrow.
- Capsule: approximately 55 pixels wide, 134 pixels tall; label approximately 189 pixels tall, with 52 pixels of glass below it.
- Character photograph starts approximately 77 pixels from the frame's left edge and 495 pixels from its top; the text begins around x=823.
- Sampled median reference colors: wine ink RGB(123,38,51), paper RGB(236,230,216). These values informed the CSS palette.

## Implementation

The bottle geometry is wider, with a shoulder that swells low down, a larger rolled capsule and a rounded heel. The physical label remains clear of the glass. Open-case bottle spacing was adjusted to accommodate the new width. Six editable GLB models remain available.

The primary bottle appearance uses an original, reference-guided transparent photographic plate generated with ImageGen. `src/bottle-photo.js` places it on a plane in the same WebGL scene, driven by the existing scroll pose and docking coordinates. The procedural bottle is retained as an invisible shadow caster. This is a hybrid photographic presentation, not a fully volumetric reconstruction of the reference's exact materials. The photographic detail does not change as a true surface reflection when viewed from a new angle; the designed scroll motion uses only shallow rotation.

The burgundy and gold photographic variants share the same crop and measured width/height. Texture-coordinate cropping removes transparent margins without modifying the original PNG. Magnum and half cutouts use their own scale proportions. Catalog cases continue to use 3D geometry and the existing original oak texture. The catalog is prerendered, so supporting products add no runtime WebGL scenes.

The winemaker photograph is a new image based on the scene in the supplied screenshot. The former photograph is retained. Desktop character layout, logo size, title width, ink wear and scrollbar treatment were corrected. Initial chapter links are restored after font layout settles, so a direct `#character` URL opens the intended composition.

## Generated assets

- `design/assets/winemaker-v3.png` → `public/assets/winemaker-v3.webp`
- `design/assets/bottle-photo-v3.png` → `public/assets/bottle-photo-v3.webp`
- `design/assets/bottle-gold-v3.png` → `public/assets/bottle-gold-v3.webp`

The two bottle images are 974 × 1615 with actual RGBA transparency. The original files are preserved. All three assets were inspected before integration. The source screenshot was used as generation guidance, not embedded as the webpage or extracted as its visible bottle.

## Remaining differences

The source template's original volumetric model, textures, typeface, stamp and film have not been supplied. The generated photographs and substitute type remain recreated assets. Exact pixel identity is not claimed. Interactive forms retain their previously documented browser-local behavior.
