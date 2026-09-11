# Print button for work orders

Add a Print option to every work order entry in the admin submissions area, available in all tabs (New, Reviewed, Archived, All).

## What you'll see

- Each work order entry gets a "Print" button next to Edit.
- Clicking it opens the browser print dialog with a clean, one-page-style printout of that work order: customer info, job details, job description, recommendations, technician info, billing info, and photo thumbnails.
- Website navigation, buttons, and admin controls are left out of the printout.
- Works the same no matter which category the entry is filed under.

## Technical notes

- Update `src/components/admin/WorkOrderSubmissionCard.tsx`: add a `Printer` action button that renders the submission into a hidden print container and calls `window.print()`.
- Create `src/components/admin/WorkOrderPrintView.tsx` with a print-only layout (`hidden print:block`) reusing the existing value formatters (`formatValue`, `formatPaymentMethod`, `formatBillingStatus`).
- Add print CSS rules in `index.css` under a `@media print` block: hide app chrome (`.no-print`), show only the active print view, keep photos at a reasonable size, use black-on-white text.
- Photos render as images with `break-inside: avoid`; page keeps the existing design tokens so no hardcoded colors are introduced.
- No backend, data, or status logic changes.
