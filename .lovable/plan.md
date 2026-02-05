
# Make the "Add a Review" Form Functional

## Overview
Connect the existing review submission form to the database so customer reviews are saved as "pending" for admin approval before appearing on the public testimonials page.

## What Will Happen
1. When a visitor submits a review, it will be saved to the database with a "pending" status
2. The review will appear in the Admin Dashboard for moderation
3. Admins can approve or reject the review
4. Only approved reviews will show on the public Reviews page

## Implementation Details

### 1. Add Star Rating to the Form
- Add a 5-star rating selector so customers can rate their experience
- This matches the existing review structure that requires a rating

### 2. Create Review Submission Function
- Add a new function in `useReviews.tsx` hook to insert reviews
- Reviews will be saved with:
  - `status: 'pending'` (requires admin approval)
  - `source: 'manual'` (submitted via website form)
  - `rating: [user selected]`
  - All form fields (name, location, title, review text)

### 3. Update the Form Handler
- Replace the placeholder `handleSubmit` with actual database insertion
- Add loading state while submitting
- Show success/error messages
- Clear form on successful submission

### 4. Input Validation
- Validate all inputs before submission
- Ensure name and review text are not empty
- Validate email format
- Limit text lengths for security

## Files to Modify
- `src/hooks/useReviews.tsx` - Add `submitReview` function
- `src/pages/TestimonialsPage.tsx` - Update form with rating picker and real submission

## Security Notes
- Reviews are inserted with RLS policies - the `reviews` table allows inserts only by admins
- We'll need to create an edge function to handle public review submissions securely
- The edge function will use the service role to bypass RLS for inserting pending reviews
