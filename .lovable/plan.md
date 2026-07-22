Update the Work Order photo upload limit from 5MB to 25MB per image (video limit stays at 20MB, max 5 files unchanged).

Files to edit:
- `src/components/work-order/PhotoUpload.tsx` — change the `maxSize` for images from `5 * 1024 * 1024` to `25 * 1024 * 1024`, update the `maxLabel` for images to `'25MB'`, and update the helper text below the upload button to say "Max 25MB per image, 20MB per video."

No backend changes needed — the edge function accepts image URLs after upload; Supabase Storage default per-file cap is well above 25MB.