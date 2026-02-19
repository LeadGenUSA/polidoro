
## Create a Financing Page

### What We're Building

A new `/financing` page showcasing the three Regions Bank home improvement loan programs, with clickable banners that open the pre-qualification portal in a new tab. The "Financing Available" button in the Hero section will be linked to this page.

### Files to Create / Modify

**1. Copy uploaded assets to `src/assets/financing/`**
- `PreQualify_AsLowAs_8.99_TIL.png` — Traditional Installment Loan banner
- `PreQualify_12Mo-SAC.png` — 12-Month Same-As-Cash banner
- `PreQualify_9.99-5Yr.png` — 9.99% 5-Year Loan banner
- `1-ELP_Regions_branded_social_banner_ad_template_General_1600x1600_07312024_digital_v1.jpg` — Hero banner image
- `image001.png` — Regions Home Improvement Financing logo

**2. Create `src/pages/Financing.tsx`**

The page will include:

- **Hero section** — using the Regions branded banner image with a headline "Flexible Financing for Your Home Project"
- **Intro section** — brief copy explaining financing is available through Regions Bank
- **Three loan cards** — each with:
  - The banner image as a clickable link (opens in new tab)
  - Loan program title
  - Key benefit summary
  - Legal disclaimer text (from the text file)
  - "PreQualify Now" button linking to the specific EnerBank URL

The three programs and their links:
  - **Traditional Installment Loan** (as low as 8.99% APR) → `https://prequalification.enerbank.com/apply/loanproduct?...loanCode=DEL2622...`
  - **12-Month Same-As-Cash** (no payments/interest for 12 months) → `https://prequalification.enerbank.com/apply/loanproduct?...loanCode=DEL2625...`
  - **9.99% APR 5-Year Loan** → `https://prequalification.enerbank.com/apply/loanproduct?...loanCode=DEL2674...`

- **CTA section** at the bottom — "Have questions? Call us" with the phone number

- **SEO component** with appropriate title/description

**3. Update `src/App.tsx`**
- Add `import Financing from "./pages/Financing";`
- Add route: `<Route path="/financing" element={<Financing />} />`

**4. Update `src/components/Hero.tsx`**
- Change the "Financing Available" `<a href="#">` to `<Link to="/financing">` so it navigates to the new page

**5. Update `src/components/Navbar.tsx`**
- Add `{ name: 'Financing', href: '/financing', external: false }` to the `externalLinks` array so it appears in the "Links" dropdown in both desktop and mobile menus

**6. Update `src/components/Footer.tsx`**
- Add a "Financing" link to the Quick Links section

### Technical Notes
- All banner images are imported as ES6 modules from `src/assets/financing/`
- All EnerBank links open with `target="_blank" rel="noopener noreferrer"`
- Legal disclaimer text is displayed in small print below each loan card, matching the content from the text file exactly
- SEO metadata included for the new page
