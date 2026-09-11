# Import work orders from a spreadsheet

Yes — this can be added. Admins get an "Import from Excel" button on the Work Orders tab of the submissions area, so past or bulk work orders can be loaded without filling out the form.

## How it will work

1. Admin opens Admin > Submissions > Work Orders and clicks **Import from Excel**.
2. Picks an `.xlsx`, `.xls`, or `.csv` file.
3. The screen reads the column headings and shows a mapping step: each spreadsheet column can be matched to a work order field (customer name, address, phone, email, job description, technician, hours, date, charges, and the rest). Obvious matches are pre-selected automatically.
4. A preview shows the first few rows exactly as they will be saved, plus a count of rows that look empty or unusable.
5. Admin confirms, and the rows are saved into the work order list in batches, with a progress indicator and a final summary ("142 imported, 3 skipped").

Imported work orders are saved with status **New** so they show up like any other submission, and can be reviewed, edited, or archived normally.

## Notes

- No emails are sent for imported rows, as requested.
- Photos cannot come from a spreadsheet; imported records will have no photos attached.
- Every field on a work order is optional, so partial spreadsheets import fine — blank cells stay blank.
- Import is admin-only; the existing access rules already restrict this.

## Technical details

- Add `xlsx` (SheetJS) to parse workbooks in the browser; first sheet, header row detected from row 1.
- New `src/components/admin/WorkOrderImportDialog.tsx`: file input, header-to-column mapping UI (Select per target field), preview table, progress state.
- Target fields come from the existing `work_order_submissions` columns (all text, all nullable); values are coerced to strings, dates normalised to `YYYY-MM-DD` text, `status` forced to `new`.
- Insert via `supabase.from('work_order_submissions').insert(chunk)` in chunks of 100 through the existing admin session; no edge function and no schema change needed.
- Mount the button next to the existing export controls in `SubmissionsManager.tsx`, shown only when `submissionType === 'work_orders'`; refresh the list on completion.
