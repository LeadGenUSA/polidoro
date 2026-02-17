

# Add Thank You Modal After Review Submission

## Overview
Replace the current toast notification with a polished modal dialog that thanks the user after successfully submitting a review on the `/reviews` page.

## Current Behavior
After submitting a review, a small toast notification appears briefly in the corner. This can be easy to miss.

## New Behavior
A centered modal dialog will appear with a thank-you message, a star icon, and a close button. The form resets as it does now, and the modal provides clear confirmation that the submission was received.

## Technical Details

### File: `src/pages/TestimonialsPage.tsx`
- Add a `showThankYou` state variable (boolean, default `false`)
- On successful submission, set `showThankYou` to `true` instead of showing a toast
- Add a `Dialog` component at the bottom of the page that displays when `showThankYou` is `true`
- The dialog will contain:
  - A star/check icon
  - "Thank You!" heading
  - Message: "Your review has been submitted and will appear after approval."
  - A "Close" button that sets `showThankYou` back to `false`
- Import `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription` from existing UI components
- Keep the error toasts as-is (only the success path changes)

