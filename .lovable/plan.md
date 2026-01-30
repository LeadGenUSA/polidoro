

## Replace Logo in Header and Footer

This plan will update the logo throughout the site using the new NYC skyline logo you've uploaded.

### Implementation Steps

1. **Copy the new logo to the project assets**
   - Copy `user-uploads://big-city-plumbing-and-heating-logo-2.png` to `src/assets/` folder
   - This will be saved as a new file to avoid any caching issues with the old filename

2. **Update the Navbar component**
   - Modify `src/components/Navbar.tsx` to import the new logo file
   - The existing sizing (`w-24 h-24`) and styling (`rounded-full object-cover`) will be preserved

3. **Update the Footer component**
   - Modify `src/components/Footer.tsx` to import the same new logo file
   - Same sizing and styling will be maintained

### Technical Details

The new logo features the NYC skyline with the Brooklyn Bridge and "Big City Plumbing & Heating" text at the top - a much more professional and location-specific branding compared to the previous logo.

By using a new filename, we'll avoid any browser caching issues that were causing the old logo to persist.

