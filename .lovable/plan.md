
## Replace "Financing Available" Text Button with Regions Logo Image

### What's Changing

In `src/components/Hero.tsx`, the current "Financing Available" floating card (lines 275–277) displays plain text inside a card box. We'll replace the text with the uploaded Regions Home Improvement Financing logo image, keeping the same card style and link behavior.

### Steps

**1. Copy the uploaded image into the project**
- Source: `user-uploads://image001-2.png`
- Destination: `src/assets/financing/regions-logo.png` (overwrite the existing placeholder logo already there)

**2. Update `src/components/Hero.tsx`**
- Import `regionsLogo` from `@/assets/financing/regions-logo.png` (already exists in the financing page, just needs adding to Hero.tsx)
- Replace the `<p>Financing Available</p>` inside the Link with `<img src={regionsLogo} alt="Regions Home Improvement Financing" className="h-12 w-auto object-contain" />`
- Keep the wrapping `<Link>` and card styles (`bg-card p-4 rounded-2xl shadow-large animate-float animation-delay-400 hover:scale-105 transition-transform`) intact so it still floats and links to `/financing`

### File Changed

- **`src/assets/financing/regions-logo.png`** — replaced with the uploaded Regions logo
- **`src/components/Hero.tsx`** — swap text for logo image, add import
