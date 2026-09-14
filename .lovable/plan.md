# Remove the Column Mapping Step from CSV Import

Go back to a one-step import: pick the file, see a preview, confirm. The column headings in your file are matched to work order fields automatically by name.

## How it works

1. Click Import CSV and choose your file.
2. Each column heading is matched to the work order field with the same name. Matching ignores case, spaces, underscores and dashes, and common alternatives still work (for example "Customer", "Phone Number", "Service Date").
3. The dialog shows how many rows were read, which headings were matched, which were not, and a preview of the first 5 rows.
4. Any heading that does not match a work order field is added to that record's job notes as "Heading: value", so nothing is lost.
5. Confirm, and the rows are saved into the Imported tab.

Unchanged: no emails are sent, photos are not imported, duplicates are not detected.

## Technical notes

- `src/components/admin/WorkOrderImportDialog.tsx`: remove the mapping table, the `Select` imports, the `NONE` constant and the `mapping` state. Build the record set directly from `buildHeaderMapping(headers)` converted to a `ColumnMapping`, keep the matched/ignored summary line, the 5-row preview, and the chunked insert with `status: 'imported'`.
- `src/lib/workOrderCsvImport.ts`: keep `parseCsv`, `matchHeader`, `buildHeaderMapping`, `initialColumnMapping`, `rowsToWorkOrders` and `fieldLabel` as they are — `rowsToWorkOrders` already appends unmapped columns to `job_description`.
- No database or schema changes.
