# Update Favicon

## Goal
Use the uploaded skyline/sun image as the site's favicon.

## Steps

1. **Generate favicon files** from `user-uploads://Layer_9-2.png` using Python/PIL:
   - `public/favicon.ico` — multi-size (16, 32, 48)
   - `public/favicon-16.png`, `public/favicon-32.png`, `public/favicon-192.png`
   - `public/apple-touch-icon.png` (180×180)
   - Preserve transparency; the image already has whitespace around it so it will render fine at small sizes.

2. **Update `index.html`** `<head>` favicon link tags to reference the new files (replace the existing `<link rel="icon">` set).

3. **Verify** with `bun run build` and confirm the new icon appears in the browser tab (hard refresh may be needed — browsers cache favicons aggressively).

## Notes
- The logo on the site itself is not being changed by this plan — only the browser tab icon.
