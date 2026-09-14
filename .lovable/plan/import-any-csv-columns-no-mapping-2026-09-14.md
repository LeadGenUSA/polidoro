# Import Any CSV Columns, No Mapping

Drop the mapping step. Pick the file, see a preview, confirm. Every column in your file is imported, whether or not it matches a work order field — and all of it is searchable.

## How it works

1. Click Import CSV and choose your file.
2. Columns whose headings match a work order field (ignoring case, spaces, underscores and dashes) fill that field.
3. Every other column is imported too, kept under its own heading exactly as written in your file.
4. The dialog shows the row count and a preview of the first 5 rows before you confirm.
5. Confirmed rows land in the Imported tab. Opening a record shows the standard fields plus an "Additional Details" list of the extra columns.
6. The search box on Submissions searches the extra columns as well, by heading and by value.

Unchanged: no emails are sent, photos are not imported, duplicates are not detected.

## Technical notes

- Migration: add `extra_fields jsonb` (nullable) to `public.work_order_submissions`. No grant or policy changes needed — existing table grants and policies cover it.
- `src/lib/workOrderCsvImport.ts`: `rowsToWorkOrders(rows, headers)` returns records with auto-matched fields plus `extra_fields` holding `{ heading: value }` for every unmatched non-empty column, instead of appending them to `job_description`.
- `src/components/admin/WorkOrderImportDialog.tsx`: remove the mapping table, `Select` imports, `NONE` constant and `mapping` state. Keep the file input, matched/extra heading summary, 5-row preview and chunked insert with `status: 'imported'`.
- `src/components/admin/WorkOrderSubmissionCard.tsx`: in the expanded view, render `extra_fields` entries as a labelled "Additional Details" key/value list when present.
- `src/components/admin/SubmissionsManager.tsx`: the all-field search already recurses into nested values, so `extra_fields` keys and values are covered once the column exists; confirm `extra_fields` is not caught by the excluded-key suffix rules.
- Regenerate Supabase types after the migration.
