# Column Mapping for Work Order CSV Import

Add a mapping step to the Work Orders CSV import so every column in your file lands in the work order field you choose.

## How it works

1. Click Import CSV and pick your file as before.
2. A mapping screen appears listing each column heading from your file, with a dropdown next to it showing the work order fields (Customer Name, Phone, Job Date, Total Charges, and so on).
3. Headings that clearly match a field are pre-selected automatically; you can change any of them.
4. Each work order field can only be used once — picking it for one column removes it from the other dropdowns.
5. Any column left as "Don't import" is not discarded: its heading and value are appended to that record's job description, so nothing is lost.
6. A preview below the mapping shows the first few rows exactly as they will be saved.
7. Confirm, and the rows are saved into the Imported tab as before.

Still true: no emails are sent, photos are not imported, and duplicate rows are not detected.

## Technical notes

- `src/lib/workOrderCsvImport.ts`: add a field label map for display, and change `rowsToWorkOrders` to accept an explicit `Record<header, WorkOrderField | null>` mapping instead of the auto-only `HeaderMapping`. Unmapped headers with a non-empty value are collected and appended to `job_description` as `Heading: value` lines (after any value already mapped to `job_description`), separated by newlines.
- `src/components/admin/WorkOrderImportDialog.tsx`: after parsing, render a mapping table (one row per CSV header: heading, sample value from row 1, a `Select` of work order fields plus a "Don't import" option). Initialize selections from `buildHeaderMapping`. Enforce uniqueness by disabling fields already chosen elsewhere. Recompute `records` whenever a selection changes; keep the existing 5-row preview and chunked insert with `status: 'imported'`.
- No database or schema changes.
