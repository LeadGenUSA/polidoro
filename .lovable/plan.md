

## Make Work Orders Editable in Admin

### Approach
Add an "Edit" button to each `WorkOrderSubmissionCard` that opens a Dialog with a form pre-populated with the work order's current values. On save, update the record in `work_order_submissions` via the Supabase client. No database migration needed -- the existing RLS policy already allows admin updates.

### Changes

#### 1. New component: `src/components/admin/WorkOrderEditDialog.tsx`
- A Dialog containing a form with all editable work order fields, organized by section (Customer Info, Job Details, Technician Info, Billing Info)
- Fields: `customer_name`, `street_address`, `apt_number`, `phone`, `zip_code`, `email`, `email_to`, `calendar_info`, `boiler_type` (Select dropdown), `error_code`, `make_model`, `serial_number`, `job_description`, `recommendations`, `rga_navien_tech`, `water_sampling_ph`, `parts_under_warranty`, `tech_on_job`, `hours_on_job`, `job_date`, `job_completed`, `payment_method` (Select dropdown), `billing_status` (Select dropdown), `total_charges`
- Photos are display-only (not editable here)
- Uses standard Input, Textarea, and Select components
- Calls an `onSave` callback with the updated fields

#### 2. Update `src/hooks/useSubmissions.tsx`
- Add an `updateSubmission` function that performs a Supabase `update` on the `work_order_submissions` table by ID, then refreshes the list
- Return it from the hook

#### 3. Update `src/components/admin/WorkOrderSubmissionCard.tsx`
- Add an "Edit" button (Pencil icon) to the actions bar
- On click, open the `WorkOrderEditDialog` with the current submission data
- Pass `onSave` handler that calls `updateSubmission`

#### 4. Update `src/components/admin/SubmissionsManager.tsx`
- Pass the new `updateSubmission` function down to `WorkOrderSubmissionCard` as an `onEdit` prop

