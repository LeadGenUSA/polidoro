
## Create a Dedicated Contact Us Page

### What Changes
A new `/contact-us` page will be created, reusing the existing `Contact` component (which already has the form, contact info cards, and thank-you modal). The page will follow the site's "blue header" pattern and the "Contact" links in both the header navbar and footer will point to this new page instead of the `/#contact` hash link.

### Page Content
- Blue hero header section with title "Contact Us" and a subtitle
- The existing Contact component (form + contact info cards + thank-you modal) embedded below
- An embedded Google Maps iframe showing the service area
- Navbar and Footer wrapping the page

### Navigation Updates

**Header (Navbar.tsx)**
- Desktop "Contact" link: change `to="/#contact"` to `to="/contact-us"`
- Mobile "Contact" link: same change
- Remove the hash-scroll logic for `/#contact`

**Footer (Footer.tsx)**
- "Contact" quick link: change `href="/#contact"` to a `<Link to="/contact-us">`

### Technical Details

**New file: `src/pages/ContactUs.tsx`**
- Imports `Navbar`, `Footer`, and the existing `Contact` component
- Renders a `bg-primary` hero header (consistent with other pages like Services, Work Order, etc.)
- Renders the `Contact` component below
- Optionally includes a Google Maps embed for the service area

**Modified file: `src/App.tsx`**
- Import `ContactUs` page
- Add route: `<Route path="/contact-us" element={<ContactUs />} />`

**Modified file: `src/components/Navbar.tsx`**
- Change desktop Contact link from `to="/#contact"` to `to="/contact-us"`
- Change mobile Contact link from `to="/#contact"` to `to="/contact-us"`

**Modified file: `src/components/Footer.tsx`**
- Change the Contact quick link from `<a href="/#contact">` to `<Link to="/contact-us">`

No new dependencies or database changes needed.
