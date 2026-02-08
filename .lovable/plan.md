
# Privacy Policy and Terms of Service Pages

## Summary
Create two new legal pages for the website: Privacy Policy and Terms of Service. These pages will follow the existing site design patterns and be linked from the Footer.

## Files to Create

### 1. `src/pages/PrivacyPolicy.tsx`
A new page containing the Privacy Policy with sections covering:
- Information Collection (personal info, contact forms, cookies)
- How Information is Used
- Information Sharing
- Data Security
- Your Rights
- Contact Information
- Policy Updates

### 2. `src/pages/TermsOfService.tsx`
A new page containing Terms of Service with sections covering:
- Acceptance of Terms
- Services Description
- User Responsibilities
- Estimates and Pricing
- Limitation of Liability
- Warranty Information
- Governing Law (New York State)
- Contact Information

## Files to Modify

### 3. `src/App.tsx`
Add two new routes:
- `/privacy-policy` for the Privacy Policy page
- `/terms-of-service` for the Terms of Service page

### 4. `src/components/Footer.tsx`
Update the placeholder links to use React Router's `Link` component:
- Change Privacy Policy link from `href="#"` to `to="/privacy-policy"`
- Change Terms of Service link from `href="#"` to `to="/terms-of-service"`

## Design Approach
Both pages will follow the established site design:
- Navy blue hero section with gradient (`hero-gradient pt-32 pb-20`)
- Page title badge and heading matching other pages (About Us, Testimonials)
- Card-based content sections for each policy topic
- Consistent typography using `font-heading` for headings
- Footer at the bottom

## Content Customization
The legal content will be tailored specifically for Big City Plumbing & Heating Inc.:
- Company name and contact info included
- References to plumbing/heating services
- New York State jurisdiction
- Service area mentions (Nassau, Suffolk, NYC)
