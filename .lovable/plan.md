

## Add JSON-LD Structured Data for Enhanced Search Visibility

### What This Does
JSON-LD (Linked Data) is code that helps Google understand your business details -- name, address, phone number, services, hours, and reviews. This can unlock rich results in search (star ratings, business info panels, FAQ dropdowns) and improve local SEO significantly.

### Schemas to Add

**1. LocalBusiness (Homepage)**
Tells Google this is a local plumbing/heating business. Includes:
- Business name, description, logo, phone numbers
- Service areas (Long Island, NYC boroughs)
- Opening hours (24/7 emergency available)
- Owner info (Michael Polidoro)
- Aggregate rating placeholder

**2. Service (Plumbing Services page + Heating Services page)**
Marks each specialized service page so Google understands what services are offered and by whom.

**3. FAQPage (Blog posts with FAQs)**
Enables FAQ rich results (expandable Q&A directly in Google search results) for blog posts that have FAQ sections.

### Technical Details

**1. Enhance `src/components/SEO.tsx`**
- Add an optional `jsonLd` prop that accepts a structured data object
- Render it as a `<script type="application/ld+json">` tag inside `<Helmet>`

**2. Update `src/pages/Index.tsx`**
- Pass a `LocalBusiness` JSON-LD object with:
  - `@type`: "Plumber" (subtype of LocalBusiness)
  - `name`: "Big City Plumbing and Heating"
  - `telephone`: ["631-361-9500", "718-326-5833"]
  - `address`: showroom address
  - `areaServed`: Long Island, Nassau, Suffolk, NYC boroughs
  - `openingHours`: "Mo-Su 00:00-23:59"
  - `founder`: Michael Polidoro
  - `url`, `logo`, `description`

**3. Update `src/pages/PlumbingServices.tsx`**
- Pass a `Service` JSON-LD object listing plumbing service offerings

**4. Update `src/pages/HeatingServices.tsx`**
- Pass a `Service` JSON-LD object listing heating service offerings

**5. Update `src/pages/BlogPost.tsx`**
- When a blog post has FAQs, pass a `FAQPage` JSON-LD object with the questions and answers

### Files Modified
- `src/components/SEO.tsx` -- add `jsonLd` prop support
- `src/pages/Index.tsx` -- add LocalBusiness schema
- `src/pages/PlumbingServices.tsx` -- add Service schema
- `src/pages/HeatingServices.tsx` -- add Service schema
- `src/pages/BlogPost.tsx` -- add FAQPage schema (conditional on FAQs existing)

No new dependencies required.
