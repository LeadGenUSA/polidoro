

## Add Navien Boiler Image to Heating Services Page

### What will change
A Navien boiler product image will be added to the Heating Services page, positioned between the subtitle text ("Comprehensive heating solutions backed by decades of experience and trusted brand partnerships.") and the services grid (which starts with "Radiant Heat Design & Installation").

### Steps

1. Copy the uploaded image (`NFB-C-2021-small.png`) into `src/assets/` for proper bundling.
2. In `src/pages/HeatingServices.tsx`:
   - Import the new image asset.
   - Insert an `<img>` element between the header/subtitle block (line ~108) and the services grid (line ~110), centered on the page with appropriate sizing and spacing.

