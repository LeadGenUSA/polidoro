

## Create Plumbing Services Page

This task involves creating a new dedicated page for plumbing services based on the content from your existing website, and adding it to the site navigation.

### Content to Include

Based on your website, the new page will feature:

**Services List (12 items):**
- Plumbing repairs and installation
- Plumbing permits and violations removed
- RPZ installation
- Hot water heaters (Tank and Tankless, gas and oil)
- Fiberglass one piece shower enclosures
- Faucets/Sinks/Toilets repaired and installed
- Slab leaks repaired
- Circulator pumps repaired and installed
- Consulting services available
- Water Filtration Systems
- Emergency Service
- Gas Line repairs and installations

**Additional Sections:**
- Cost/Estimates section with written estimate guarantee
- Emergency service messaging
- Contact call-to-action (631-361-9500)

### Files to Create/Modify

**1. Create `src/pages/PlumbingServices.tsx`**
- Hero section with gradient background (matching existing page style)
- Services grid with icons for each service
- "Worried about cost?" section with estimate guarantee info
- Emergency services callout
- Contact CTA section
- Navbar and Footer components included

**2. Update `src/App.tsx`**
- Import the new PlumbingServices component
- Add route: `/plumbing-services`

**3. Update `src/components/Navbar.tsx`**
- Add "Plumbing Services" to the navigation links array

### Design Approach

The page will follow the existing design patterns seen in HowToVideos and TestimonialsPage:
- Hero section with `hero-gradient` background
- Service items displayed in a responsive grid with cards
- Icons from lucide-react for each service type
- Consistent typography using the `font-heading` class
- CTA buttons using the existing `hero` variant

### Technical Details

| Component | Description |
|-----------|-------------|
| Layout | Navbar + Hero + Content + Footer |
| Styling | Tailwind CSS with existing custom classes |
| Icons | lucide-react (Wrench, Droplets, Flame, etc.) |
| Responsive | Mobile-first grid (1 col → 2 col → 3 col) |

