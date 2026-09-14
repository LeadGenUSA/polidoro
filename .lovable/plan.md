# Import CSV for Work Orders

Add an "Import CSV" button on the Work Orders section of Admin → Submissions, and a new **Imported** tab beside Archived that holds those records separately from New, Reviewed and Archived.

## How it works

1. With Work Orders selected, an "Import CSV" button appears next to the export buttons.
2. You pick a `.csv` file. Column headings are matched automatically to work order fields (e.g. "Customer Name", "Phone", "Job Date", "Total Charges"). Matching ignores case, spaces, underscores and dashes. Columns that don't match anything are skipped.
3. A preview shows how many rows were read, which headings were matched, which were ignored, and the first few rows.
4. On confirm, the rows are saved as work orders marked **Imported**.
5. Imported rows only ever appear in the Imported tab. They never show up in New, Reviewed, Archived or the counts for those tabs, and their status cannot be changed to those. They can still be opened, searched, printed, exported and deleted.

No emails are sent for imported rows. Photos are not part of the import.

Duplicate rows are not detected — importing the same file twice creates two sets of records. Delete unwanted rows from the Imported tab if that happens.

## Technical notes

- Migration: add `imported` to the `submission_status` enum. No other schema change; `work_order_submissions` columns are already nullable.
- `useSubmissions`: extend `SubmissionStatus` with `imported`; add an `imported` count; exclude `imported` from the `new`/`reviewed`/`archived` counts and from the `all` listing (the `all` view queries `status <> 'imported'`).
- New `src/lib/workOrderCsvImport.ts`: dependency-free CSV parser (quoted fields, embedded commas/newlines), a header-alias map to `work_order_submissions` columns, and a normalizer that trims values and drops empties.
- New `src/components/admin/WorkOrderImportDialog.tsx`: file input, parse preview (row count, matched/ignored headers, first 5 rows), confirm action that batch-inserts (chunks of 100) with `status: 'imported'`, then refreshes the list. Errors surface as a toast.
- `SubmissionsManager.tsx`: show the Import CSV button only for `work_orders`; add the Imported tab trigger and content after Archived, rendered with the existing `WorkOrderSubmissionCard`.
- `WorkOrderSubmissionCard.tsx`: when status is `imported`, show an "Imported" badge and hide the New/Reviewed/Archived status actions; keep Print, Edit and Delete.
- Regenerate Supabase types after the migration.
