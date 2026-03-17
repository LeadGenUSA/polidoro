

## Add calendarInfo and boilerType to work_order_submissions

### Database Migration
Add two nullable text columns to `work_order_submissions`:
```sql
ALTER TABLE public.work_order_submissions
  ADD COLUMN calendar_info text,
  ADD COLUMN boiler_type text;
```

### Edge Function Update (`supabase/functions/send-work-order/index.ts`)
Add the two new fields to the database insert (around line 153):
- `calendar_info: data.calendarInfo || null`
- `boiler_type: data.boilerType || null`

### Admin Display (`src/components/admin/WorkOrderSubmissionCard.tsx`)
Add Calendar Info and Boiler Type to the card display:
- Show Calendar Info in the Customer Info section
- Show Boiler Type in the Job Details section

### Types
The `WorkOrderSubmission` interface in `src/hooks/useSubmissions.tsx` needs `calendar_info` and `boiler_type` fields added. The generated types file will update automatically after migration.

