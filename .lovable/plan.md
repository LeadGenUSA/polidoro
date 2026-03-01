

## Update Review Source Labels

### Summary
Three changes to clarify review labeling across admin and public pages.

### 1. Admin Dashboard (ReviewCard.tsx)
Change the source label for `manual` from "Manual" to "By Admin", keeping `website` as "Website Review".

### 2. Public Reviews Page (TestimonialsPage.tsx)
Add a badge for `website` source reviews so they also display "Website Review" -- currently only `manual` source shows the badge. Both `manual` and `website` will show the Globe icon with "Website Review" text on the public page.

---

### Technical Details

**File: `src/components/admin/ReviewCard.tsx`**
- Change `sourceLabels` map: `manual: 'Manual'` becomes `manual: 'By Admin'`

**File: `src/pages/TestimonialsPage.tsx`**
- Change the condition on line 217 from `testimonial.source === 'manual'` to `(testimonial.source === 'manual' || testimonial.source === 'website')` so both types show the "Website Review" badge on the public page

