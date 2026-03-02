

## Server-Side HEIC to JPEG Conversion

### Overview
Create a backend function that converts HEIC images to JPEG on upload. All 5 upload points across the app will send HEIC files to this function instead of directly to storage. Non-HEIC files continue uploading directly as before (no unnecessary overhead).

### Architecture

```text
[User selects HEIC] --> [Client detects HEIC] --> [Edge Function: convert-image]
                                                        |
                                                   Converts to JPEG
                                                        |
                                                   Uploads to target bucket
                                                        |
                                                   Returns public URL
                                                        
[User selects JPG/PNG] --> [Direct upload to storage as today]
```

### Changes

**1. New Edge Function: `supabase/functions/convert-image/index.ts`**
- Accepts a multipart form upload with the HEIC file and a `bucket` parameter (e.g., "gallery", "slideshow")
- Uses the `sharp` npm library (available in Deno via `npm:sharp`) to convert HEIC/HEIF to JPEG at 90% quality
- Uploads the resulting JPEG to the specified storage bucket using the service role key
- Returns the public URL of the converted file
- Includes CORS headers for browser access
- JWT verification disabled (public upload endpoints match existing pattern)

**2. New shared utility: `src/lib/upload-helpers.ts`**
- `isHeicFile(file: File): boolean` -- checks file type (`image/heic`, `image/heif`) and extension (`.heic`, `.heif`)
- `uploadFileWithConversion(file: File, bucket: string): Promise<string>` -- if HEIC, sends to the edge function; otherwise uploads directly to storage as before. Returns the public URL.

**3. Update `src/components/estimate-form/EstimatePhotoUpload.tsx`**
- Import `uploadFileWithConversion` and replace the direct `supabase.storage.upload` call with it
- Update the `accept` attribute to include `.heic,.heif` alongside existing image types
- Update the help text to mention HEIC support

**4. Update `src/components/work-order/PhotoUpload.tsx`**
- Same changes as EstimatePhotoUpload -- use `uploadFileWithConversion` with bucket `work-order-photos`
- Update `accept` attribute and help text

**5. Update `src/hooks/useGallery.tsx`**
- Replace the `uploadImage` function internals to use `uploadFileWithConversion` with bucket `gallery`
- Update any accept attributes in GalleryManager to include HEIC

**6. Update `src/hooks/useSlideshow.tsx`**
- Replace the `uploadFile` function internals to use `uploadFileWithConversion` with bucket `slideshow`

**7. Update `src/components/admin/BlogPostEditor.tsx`**
- Replace the image upload handler to use `uploadFileWithConversion` with bucket `blog-images`

**8. Update `src/components/admin/GalleryManager.tsx`**
- Change the file input `accept` attribute from `image/*` to `image/*,.heic,.heif`

**9. Update `src/components/admin/SlideshowManager.tsx`**
- Change the file input `accept` attribute to include `.heic,.heif`

**10. Update `supabase/config.toml`**
- Add `[functions.convert-image]` with `verify_jwt = false`

### Technical Notes

- The `sharp` library handles HEIC natively and runs well in Deno edge functions via `npm:sharp`
- Converted files get a `.jpg` extension so browsers render them correctly
- Original HEIC files are never stored -- only the converted JPEG reaches the bucket
- Non-HEIC files bypass the edge function entirely, avoiding any performance penalty for standard uploads
- File size validation still happens client-side before upload

