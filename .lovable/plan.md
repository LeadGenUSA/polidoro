# Search every field in submissions

Right now the search box on the admin Submissions page only checks a handful of fields (for work orders: name, email, address, phone, job description, technician, make/model). Typing text that appears in notes, prices, dates, error codes or any other field returns nothing.

## What changes

- Search will match text found in **any** field of a work order entry: error code, serial number, recommendations, warranty notes, hours, job date, payment method, billing status, totals, calendar info, boiler type, status, and everything else.
- The same all-field search applies to Estimates and Surveys, so all three tabs behave consistently.
- Multi-value fields (like checkbox lists) are searched too.
- Photo file links and internal record IDs are skipped, so searching a common word doesn't match every entry through hidden links.
- Behaviour stays the same otherwise: case-insensitive, live filtering, works within whichever tab (New / Reviewed / Archived / All) is selected.

## Technical detail

In `src/components/admin/SubmissionsManager.tsx`, replace the per-type field lists in the `filteredSubmissions` memo with a generic matcher that walks every value of the submission record, flattens arrays, converts values to strings, and lowercase-compares against the query. Exclude the `photos` and `id` keys from the scan. No backend or schema changes.
