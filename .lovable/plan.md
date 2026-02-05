
# Display Review Source Badges

## Overview
Add visual indicators on each review card to show whether it came from Google Reviews or was submitted directly on the website.

## What Will Change
Reviews will display a small badge showing their source:
- **Google Reviews** - Shows a Google "G" icon with "Google Review" text
- **Website Submissions** - Shows a globe/website icon with "Website Review" text

## Visual Design
- Badge will appear in the review card header area, near the author info or date
- Google reviews: Google logo/icon in Google colors with subtle styling
- Website reviews: A clean badge indicating site submission
- Badges will be subtle but visible, matching the existing design aesthetic

## Technical Details
The `source` field already exists in the database with these values:
- `google` - Reviews imported from Google Places API
- `manual` - Reviews submitted via the website form
- `imported` - Bulk imported reviews

## Implementation
1. **`src/pages/TestimonialsPage.tsx`**
   - Add source badge component within each review card
   - Display appropriate icon and label based on `testimonial.source`
   - Use existing Badge component for consistent styling
   - Position badge in the header area alongside location/date info

2. **Icons**
   - Google: Use a styled "G" or Google icon
   - Website: Use the `Globe` icon from lucide-react

## File to Modify
- `src/pages/TestimonialsPage.tsx` - Add source indicator to review cards
