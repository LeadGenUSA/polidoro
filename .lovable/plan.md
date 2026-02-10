

## Connect Footer Service Links to Services Page Sections

### What Changes
The five service names listed in the footer (Plumbing Repair, Heating Systems, Tankless Water Heaters, Gas Conversion, Emergency Services) will become clickable links that navigate to the corresponding section on the `/services` page using anchor IDs.

### How It Works
1. **Add anchor IDs** to each service section on the Services page (e.g., `id="plumbing-repair"`, `id="heating-systems"`, etc.)
2. **Convert footer service text** from plain `<span>` elements to `<Link>` components pointing to `/services#plumbing-repair`, `/services#heating-systems`, etc.
3. **Add scroll behavior** so the page smoothly scrolls to the target section on navigation.

### Technical Details

**`src/pages/Services.tsx`**
- Add a `slug` field to each service object (e.g., `'plumbing-repair'`, `'heating-systems'`, `'tankless-water-heaters'`, `'gas-conversion'`, `'emergency-services'`)
- Apply `id={service.slug}` to each service section's wrapper `<div>`
- Add a `useEffect` to handle hash-based scrolling on page load (so direct links like `/services#gas-conversion` work)

**`src/components/Footer.tsx`**
- Replace the static services array with one that includes slugs
- Change each `<span>` to a React Router `<Link to={/services#slug}>` with the same hover styling as the Quick Links above it

