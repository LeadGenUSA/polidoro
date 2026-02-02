

# Add Certifications Section

## Overview
Create a new Certifications section to showcase Big City Plumbing & Heating's credentials and badges. This section will be placed between the "What Our Customers Say" (Testimonials) section and the "Get Your Free Estimate" (Contact) section on the homepage.

## Changes

### 1. Copy Certification Logos to Project Assets
Copy all 6 uploaded certification logos to `src/assets/certifications/`:
- `best-of-porch-2020.png` - Best of Porch 2020 Award
- `NYC-Master-Plumbers-Council.gif` - NYC Master Plumbers Council Member
- `wardflex-certified-small.gif` - WardFlex Trained & Certified
- `epa_leadsafecertfirm-trans.gif` - EPA Lead-Safe Certified Firm
- `National-Grid-Valueplus.gif` - National Grid Value Plus Installer
- `liheap-logo-trans.gif` - LIHEAP Low-Income Home Energy Assistance

### 2. Create Certifications Component
Create `src/components/Certifications.tsx`:
- Section with "Certifications" label badge
- Heading: "Licensed, Certified & Trusted"
- Optional subtext highlighting credentials
- Responsive grid displaying all 6 certification logos
- Each logo in a card-style container with subtle hover effects
- Consistent styling with existing sections (same padding, colors, typography)

### 3. Update Index Page
Modify `src/pages/Index.tsx`:
- Import the new Certifications component
- Add `<Certifications />` between `<Testimonials />` and `<Contact />`

## Visual Design
- Background: Light background (`bg-background`) to contrast with the gradient testimonials section above
- Logo cards: White cards with subtle shadows, centered logos
- Layout: Flexible grid (2 columns on mobile, 3 on tablet, 6 on desktop)
- Animation: Fade-in effect on scroll, matching other sections

