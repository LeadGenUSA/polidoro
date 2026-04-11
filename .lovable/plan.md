

## Add JSON-LD Schema Markup to 6 Pages

Currently only Index, PlumbingServices, HeatingServices, and BlogPost have JSON-LD schema. The following pages should get schema for richer search results:

### Pages & Schema Types

| Page | Schema Type | Key Data |
|------|------------|----------|
| `Services.tsx` | `Service` (array) | 5 services with descriptions, wrapped in `ItemList` |
| `AboutUs.tsx` | `AboutPage` + `Person` | Company info, Michael Polidoro credentials, 35+ years |
| `ContactUs.tsx` | `ContactPage` + `LocalBusiness` | Two phone numbers, showroom address, hours |
| `Financing.tsx` | `WebPage` with `FinancialProduct` offers | 3 loan programs from Regions Bank |
| `ProjectsGallery.tsx` | `ImageGallery` | Collection of project images |
| `HowToVideos.tsx` | `VideoGallery` / `ItemList` of `VideoObject` | YouTube how-to videos |

### Implementation

Each page gets a `const schema = { ... }` object defined before the return statement, then passed as `schemaJson={schema}` to the existing `SEOHead` component. No new components or dependencies needed.

All schema objects will use `"@context": "https://schema.org"` and reference `Big City Plumbing & Heating Inc.` as the provider/organization where applicable, consistent with the existing `localBusinessSchema` on the Index page.

### Files Changed (6)
- `src/pages/Services.tsx`
- `src/pages/AboutUs.tsx`
- `src/pages/ContactUs.tsx`
- `src/pages/Financing.tsx`
- `src/pages/ProjectsGallery.tsx`
- `src/pages/HowToVideos.tsx`

