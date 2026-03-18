

## Export Work Orders as ICS Calendar Events

### What
Add an "Export to Outlook" button next to the existing "Export CSV" button in the Work Orders tab. Clicking it generates a `.ics` file containing all currently filtered work orders as calendar events, which Outlook can import directly.

### How

#### `src/hooks/useSubmissions.tsx`
- Add an `exportToICS` function alongside the existing `exportToCSV`
- For each `WorkOrderSubmission`, generate a VEVENT with:
  - **DTSTART/DTEND**: Use `job_date` if available, otherwise `created_at`. Default to a 2-hour event duration.
  - **SUMMARY**: `"Work Order - {customer_name}"`
  - **LOCATION**: `"{street_address}, {apt_number}, {zip_code}"`
  - **DESCRIPTION**: Concatenate key fields: customer name, phone, email, job description, boiler type, error code, recommendations, calendar info, billing status, total charges
  - **UID**: Use the work order `id` for uniqueness
- Wrap all events in a VCALENDAR container with proper headers (`VERSION:2.0`, `PRODID`, `CALSCALE:GREGORIAN`)
- Download as `work_orders_YYYY-MM-DD.ics`

#### `src/components/admin/SubmissionsManager.tsx`
- Add an "Export to Outlook" button (Calendar icon) next to "Export CSV", visible only when `submissionType === 'work_orders'`
- Wire it to `exportToICS`

### ICS Format Details
- Dates formatted as `YYYYMMDDTHHMMSS` (local time)
- Text fields escaped (commas, semicolons, newlines per RFC 5545)
- No external dependencies needed -- pure string generation

