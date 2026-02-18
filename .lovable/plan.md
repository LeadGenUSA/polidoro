

## Add Thank You Page to Free Estimate Form

After a successful submission, the Free Estimate Form currently just shows a toast notification and resets the form. The other forms (Work Order, Customer Survey) show a full "Thank You" screen instead. This change will match that pattern.

### What will change

**File: `src/pages/FreeEstimateForm.tsx`**

1. Add an `isSubmitted` state variable (like Work Order and Survey forms already have).
2. On successful submission, set `isSubmitted = true` instead of just showing a toast and resetting form fields. The form reset logic can be removed since the component re-renders with the thank you screen.
3. Add an `if (isSubmitted)` block before the main return that renders a thank you page with:
   - Navbar and Footer for consistency
   - Blue hero header saying "Estimate Submitted"
   - A card with a green checkmark, "Thank You!" heading, a message about reviewing the estimate, and phone numbers for urgent matters
   - A "Submit Another Estimate" button that sets `isSubmitted` back to false
4. This follows the exact same pattern used in `WorkOrderForm.tsx` (lines 102-137).
