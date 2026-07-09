# Update Hero Background Image

## Goal
Replace the hero section background image with the uploaded night skyline photo (`dock-ny.png`) while keeping the existing blue overlay.

## Current State
- `src/components/Hero.tsx` imports `nycSkyline` from `@/assets/nyc-skyline.png`.
- The background image is wrapped by two blue gradient overlays (`from-primary/90`, `from-primary/95`, etc.) that give the hero its branded navy look.
- The existing `src/assets/nyc-skyline.png` is a binary file in the repo.

## Steps
1. **Create Lovable Asset** from `/mnt/user-uploads/dock-ny.png` named `nyc-skyline.png` and write the pointer to `src/assets/nyc-skyline.png.asset.json`.
2. **Delete** the old binary `src/assets/nyc-skyline.png` so the repo no longer carries the unused image.
3. **Update `src/components/Hero.tsx`**:
   - Remove the old `import nycSkyline from '@/assets/nyc-skyline.png';`.
   - Import the new asset pointer: `import nycSkyline from '@/assets/nyc-skyline.png.asset.json';`.
   - Use `nycSkyline.url` as the `src` for the background `<img>`.
   - Leave all existing overlay gradients unchanged so the blue branded look is preserved.
4. **Verify** with `bun run build` and a visual preview spot-check to ensure the new background covers the hero and the overlay still reads correctly.

## Notes
- The uploaded image is already blue-toned, so it will blend naturally with the navy overlay.
- No other pages or components are affected; this only changes the hero background on the home page.