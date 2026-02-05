
# Remove Category Filters from Testimonials Page

## Overview
Remove the non-functional category filter UI from the Reviews/Testimonials page since reviews don't have categories assigned.

## Changes to `src/pages/TestimonialsPage.tsx`

1. **Remove the `categories` array** (lines 13-31)
   - Delete the entire constant that defines filter options

2. **Remove state and filter logic**
   - Delete `activeCategory` state (line 57)
   - Delete `filteredReviews` logic (line 68)

3. **Remove the Filter component import**
   - Remove `Filter` from lucide-react imports (line 6)

4. **Remove the filter UI section** (lines 189-199)
   - Delete the flex container with filter buttons

5. **Update reviews list**
   - Change `filteredReviews.map(...)` to `reviews.map(...)`
   - Update the empty state check from `filteredReviews.length` to `reviews.length`

## Result
- Cleaner UI without confusing non-functional filters
- Reviews display in a simple list sorted by date
- Can re-add filters later if categorization is implemented
