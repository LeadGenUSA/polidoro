

# HTML Sitemap Page

## Overview
Create a visitor-facing `/sitemap` page that lists all public pages organized by category, improving navigation and SEO with internal linking.

## Page Structure

The page will be organized into these categories:

**Main Pages**: Home, Services, About Us, Contact Us

**Services**: Plumbing Services, Heating Services

**Resources**: Blog, How-To Videos, Projects Gallery, Reviews

**Forms**: Free Estimate, Work Order, Customer Survey

**Legal**: Privacy Policy, Terms of Service

## Implementation

### 1. New file: `src/pages/Sitemap.tsx`
- Follow the same layout pattern as other pages (Navbar, SEO, hero section, content, Footer)
- Display links grouped by category in a clean grid layout
- Include SEO component with appropriate title/description
- Each link uses React Router `Link` component for client-side navigation

### 2. Update `src/App.tsx`
- Import the new Sitemap page
- Add route: `/sitemap`

### 3. Update `src/components/Footer.tsx`
- Add a "Sitemap" link in the bottom bar next to Privacy Policy and Terms of Service

### 4. Update `public/sitemap.xml`
- Add the `/sitemap` page entry

### 5. Update `public/robots.txt`
- No changes needed (already allows all pages)

## Technical Details
- Follows existing page patterns (Navbar + hero-gradient header + content + Footer)
- Uses the existing SEO component for meta tags
- Grid layout: 2 columns on mobile, 4 columns on desktop
- Each category styled as a card with a heading and list of links

