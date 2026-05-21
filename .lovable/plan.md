## Goal
Replace the NYC skyline background image in the Hero section with the newly uploaded image.

## Changes
1. Copy `user-uploads://Gemini_Generated_Image_efvllpefvllpefvl.png` to `src/assets/nyc-skyline.png` (overwrite), so the existing import in `src/components/Hero.tsx` automatically picks up the new image.
   - This keeps the same overlay gradients and layout intact.
   - No code changes needed since `Hero.tsx` already imports `nycSkyline` from `@/assets/nyc-skyline.png`.

## Files
- `src/assets/nyc-skyline.png` (replace)