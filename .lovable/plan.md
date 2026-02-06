
# Store Form Submissions in Admin Dashboard

## Summary
Add database storage for **Estimate**, **Work Order**, and **Survey** form submissions (excluding Contact Form as requested), and create a new "Submissions" section in the Admin Dashboard to view and manage them, including an export function.

## Current State
- Three forms currently only send email notifications via edge functions:
  - **Free Estimate Form** (`/free-estimate`) - Detailed boiler/heating estimate requests with 30+ fields
  - **Work Order Form** (`/work-order`) - Technician job documentation with 25+ fields
  - **Customer Survey Form** (`/customer-survey`) - Customer feedback with 20+ fields
- No data is stored in the database - submissions are only emailed
- Admin dashboard has sections for: Reviews, Homepage Slideshow, Project Gallery

## Solution Overview
1. Create database tables to store ALL fields from each form type
2. Update edge functions to save complete submissions to the database (in addition to sending emails)
3. Add a new "Submissions" section to the Admin Dashboard with tabs for each form type
4. Include status tracking (new/reviewed/archived) for workflow management
5. Add an **Export** button to download submissions as CSV

---

## Database Design

### Enum: `submission_status`
```text
'new' | 'reviewed' | 'archived'
```

### Table: `estimate_submissions`
Stores ALL fields from the Free Estimate Form.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| status | submission_status | Workflow status (default: 'new') |
| created_at | timestamptz | Submission time |
| **Customer Info** | | |
| customer | text | Customer name |
| email | text | Customer email |
| cost_of_job | text | Estimated cost |
| **Boiler Info** | | |
| boiler_types | text[] | Selected boiler types |
| boiler_size | text | Boiler size |
| baseboard | text | Baseboard info |
| **Oil Tank - Buried** | | |
| buried_tank_size | text[] | Tank sizes |
| pump_and_foam | text | Y/N |
| tank_sand | text | Y/N |
| buried_price_additional | text | Y/N |
| **Oil Tank - Interior** | | |
| interior_tank_removed | text | Y/N |
| interior_tank_behind_wall | text | Y/N |
| interior_price_additional | text | Y/N |
| **Oil Tank - Exterior** | | |
| exterior_275_removal | text | Y/N |
| exterior_price_additional | text | Y/N |
| **Oil Tank - Other** | | |
| customer_responsible_for_tank | text | Y/N |
| tank_notes | text | Notes |
| **Installation Notes/Venting** | | |
| steam_system | text | Y/N |
| thermostats_included | text | Count |
| existing_chimney_lined | text | Y/N |
| chimney_lined_notes | text | Notes |
| vent_location | text | Location |
| vent_location_notes | text | Notes |
| number_of_zones | text | Zone count |
| zone_size | text | Size |
| boiler_access | text | House/Basement |
| **Gas Service/Piping** | | |
| gas_needed_for | text[] | Items needing gas |
| gas_in_house | text | Yes/No |
| gas_notes | text | Notes |
| meter_location | text | Position |
| **Photos** | | |
| photos | text[] | Photo URLs |

### Table: `work_order_submissions`
Stores ALL fields from the Work Order Form (excluding credit card data for security).

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| status | submission_status | Workflow status (default: 'new') |
| created_at | timestamptz | Submission time |
| **Customer Info** | | |
| customer_name | text | Customer name |
| street_address | text | Address |
| apt_number | text | Apartment |
| phone | text | Phone |
| zip_code | text | Zip |
| email | text | Email |
| email_to | text | CC email |
| **Job Detail** | | |
| error_code | text | Error code |
| make_model | text | Equipment model |
| serial_number | text | Serial # |
| job_description | text | Description |
| recommendations | text | Recommendations |
| rga_navien_tech | text | RGA# and tech |
| water_sampling_ph | text | PH level |
| parts_under_warranty | text | yes/no |
| **Technician Info** | | |
| tech_on_job | text | Technician name |
| hours_on_job | text | Hours worked |
| job_date | text | Date |
| job_completed | text | yes/no |
| **Billing Info** | | |
| payment_method | text | check/cash/credit_card/bill_navien |
| billing_status | text | Status enum |
| total_charges | text | Amount |
| **Photos** | | |
| photos | text[] | Photo URLs |

Note: Credit card information is intentionally NOT stored for security compliance.

### Table: `survey_submissions`
Stores ALL fields from the Customer Survey Form.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| status | submission_status | Workflow status (default: 'new') |
| created_at | timestamptz | Submission time |
| **Customer Info** | | |
| customer_name | text | Customer name |
| email | text | Email |
| phone | text | Phone |
| service_date | text | Date |
| technician_name | text | Technician |
| **Overall Satisfaction** | | |
| overall_satisfaction | text | Rating enum |
| **Service Ratings** | | |
| quality_of_work | text | Rating |
| timeliness | text | Rating |
| professionalism | text | Rating |
| communication | text | Rating |
| value_for_money | text | Rating |
| **Recommendations** | | |
| would_recommend | text | yes/no/maybe |
| use_again | text | yes/no/maybe |
| **Sales Lead Questions (Required)** | | |
| estimate_overpriced | text | yes/no |
| satisfied_with_recommendation | text | yes/no |
| were_we_professional | text | yes/no |
| comfortable_with_tech | text | yes/no |
| consider_installation | text | Response option |
| **Additional Feedback** | | |
| what_did_well | text | Comments |
| areas_to_improve | text | Comments |
| additional_comments | text | Comments |

### RLS Policies
All tables will have:
- **Admin-only access**: Full CRUD for users with 'admin' role
- **No public access**: Submissions are inserted via edge functions using service role key

---

## Edge Function Updates

### 1. `send-estimate-form/index.ts`
- Add Supabase client initialization using service role key
- After sending email successfully, insert ALL form fields into `estimate_submissions` table
- Map camelCase form fields to snake_case database columns

### 2. `send-work-order/index.ts`
- Add Supabase client initialization using service role key
- After sending email successfully, insert ALL form fields (except credit card data) into `work_order_submissions` table
- Credit card fields are intentionally excluded for security

### 3. `send-customer-survey/index.ts`
- Add Supabase client initialization using service role key
- After sending email successfully, insert ALL form fields into `survey_submissions` table

---

## Admin Dashboard Changes

### New Section: "Submissions"
Add a fourth button to the admin section selector for viewing form submissions.

### Submissions Manager Component
Create `src/components/admin/SubmissionsManager.tsx`:
- Tabs for each form type: **Estimates**, **Work Orders**, **Surveys**
- Status filter tabs: **New**, **Reviewed**, **Archived**, **All**
- Count badges showing new submissions per category
- List view with key details for quick scanning
- Expandable cards to view full submission details (all fields displayed)
- Actions: Mark as Reviewed, Archive, Delete
- **Export Button**: Download all visible submissions as CSV

### Submission Card Components
- `EstimateSubmissionCard.tsx` - Display all estimate fields organized by section, with photo gallery
- `WorkOrderSubmissionCard.tsx` - Display all work order fields organized by section, with photos
- `SurveySubmissionCard.tsx` - Display all survey fields organized by section with ratings highlighted

### Custom Hook: `useSubmissions.tsx`
- Fetch submissions by type and status
- Update submission status
- Delete submissions
- Real-time counts for new submissions

### Export Functionality
- Export button in the Submissions header
- Downloads currently filtered submissions as CSV
- Includes all fields with proper column headers
- Filename includes form type and date (e.g., `estimates_2026-02-06.csv`)

---

## File Changes Summary

### New Files
| File | Purpose |
|------|---------|
| `src/components/admin/SubmissionsManager.tsx` | Main submissions management UI with export |
| `src/components/admin/EstimateSubmissionCard.tsx` | Estimate submission display (all fields) |
| `src/components/admin/WorkOrderSubmissionCard.tsx` | Work order submission display (all fields) |
| `src/components/admin/SurveySubmissionCard.tsx` | Survey submission display (all fields) |
| `src/hooks/useSubmissions.tsx` | Data fetching, mutations, and export logic |

### Modified Files
| File | Changes |
|------|---------|
| `src/pages/Admin.tsx` | Add Submissions section button and render SubmissionsManager |
| `supabase/functions/send-estimate-form/index.ts` | Add database insert for all fields |
| `supabase/functions/send-work-order/index.ts` | Add database insert (excluding CC data) |
| `supabase/functions/send-customer-survey/index.ts` | Add database insert for all fields |

---

## Technical Implementation Details

### Database Migration SQL
```text
-- Create submission status enum
CREATE TYPE submission_status AS ENUM ('new', 'reviewed', 'archived');

-- Create estimate_submissions table with ALL fields
CREATE TABLE estimate_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status submission_status NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Customer Info
  customer TEXT NOT NULL,
  email TEXT NOT NULL,
  cost_of_job TEXT,
  -- Boiler Info
  boiler_types TEXT[],
  boiler_size TEXT,
  baseboard TEXT,
  -- Oil Tank - Buried
  buried_tank_size TEXT[],
  pump_and_foam TEXT,
  tank_sand TEXT,
  buried_price_additional TEXT,
  -- Oil Tank - Interior
  interior_tank_removed TEXT,
  interior_tank_behind_wall TEXT,
  interior_price_additional TEXT,
  -- Oil Tank - Exterior
  exterior_275_removal TEXT,
  exterior_price_additional TEXT,
  -- Oil Tank - Other
  customer_responsible_for_tank TEXT,
  tank_notes TEXT,
  -- Installation Notes/Venting
  steam_system TEXT,
  thermostats_included TEXT,
  existing_chimney_lined TEXT,
  chimney_lined_notes TEXT,
  vent_location TEXT,
  vent_location_notes TEXT,
  number_of_zones TEXT,
  zone_size TEXT,
  boiler_access TEXT,
  -- Gas Service/Piping
  gas_needed_for TEXT[],
  gas_in_house TEXT,
  gas_notes TEXT,
  meter_location TEXT,
  -- Photos
  photos TEXT[]
);

-- Create work_order_submissions table with ALL fields (except CC)
CREATE TABLE work_order_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status submission_status NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Customer Info
  customer_name TEXT NOT NULL,
  street_address TEXT NOT NULL,
  apt_number TEXT,
  phone TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  email TEXT NOT NULL,
  email_to TEXT,
  -- Job Detail
  error_code TEXT,
  make_model TEXT,
  serial_number TEXT,
  job_description TEXT NOT NULL,
  recommendations TEXT,
  rga_navien_tech TEXT,
  water_sampling_ph TEXT,
  parts_under_warranty TEXT,
  -- Technician Info
  tech_on_job TEXT,
  hours_on_job TEXT,
  job_date TEXT,
  job_completed TEXT,
  -- Billing Info
  payment_method TEXT,
  billing_status TEXT,
  total_charges TEXT,
  -- Photos
  photos TEXT[]
);

-- Create survey_submissions table with ALL fields
CREATE TABLE survey_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status submission_status NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Customer Info
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service_date TEXT,
  technician_name TEXT,
  -- Overall Satisfaction
  overall_satisfaction TEXT,
  -- Service Ratings
  quality_of_work TEXT,
  timeliness TEXT,
  professionalism TEXT,
  communication TEXT,
  value_for_money TEXT,
  -- Recommendations
  would_recommend TEXT,
  use_again TEXT,
  -- Sales Lead Questions (Required)
  estimate_overpriced TEXT,
  satisfied_with_recommendation TEXT,
  were_we_professional TEXT,
  comfortable_with_tech TEXT,
  consider_installation TEXT,
  -- Additional Feedback
  what_did_well TEXT,
  areas_to_improve TEXT,
  additional_comments TEXT
);

-- Enable RLS on all tables
ALTER TABLE estimate_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_order_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_submissions ENABLE ROW LEVEL SECURITY;

-- Admin-only policies
CREATE POLICY "Admins can manage estimate submissions"
  ON estimate_submissions FOR ALL
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage work order submissions"
  ON work_order_submissions FOR ALL
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage survey submissions"
  ON survey_submissions FOR ALL
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));
```

### Edge Function Insert Pattern
```text
// After sending email successfully, insert to database
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

await supabaseAdmin.from('estimate_submissions').insert({
  customer: formData.customer,
  email: formData.email,
  cost_of_job: formData.costOfJob,
  boiler_types: formData.boilerTypes,
  // ... all other fields mapped from camelCase to snake_case
  photos: formData.photos,
  status: 'new'
});
```

### Export CSV Function
```text
const exportToCSV = (submissions: Submission[], type: string) => {
  // Convert submissions to CSV format
  const headers = Object.keys(submissions[0] || {});
  const csvContent = [
    headers.join(','),
    ...submissions.map(row => 
      headers.map(h => `"${row[h] || ''}"`.replace(/"/g, '""')).join(',')
    )
  ].join('\n');
  
  // Download file
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${type}_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
};
```

---

## Security Considerations
- Credit card information from Work Orders is NOT stored in the database (security compliance)
- Edge functions use service role key to bypass RLS for inserts only
- Admin-only RLS policies protect read/update/delete access
- All data is encrypted at rest in the database

---

## User Experience

### Admin Dashboard Flow
1. Click "Submissions" button in admin section selector
2. See tabs for each form type with "new" count badges
3. Filter by status: New (default), Reviewed, Archived, All
4. Click "Export" to download visible submissions as CSV
5. Click a submission card to expand and view all details
6. Mark as Reviewed or Archive to manage workflow
7. Delete submissions when no longer needed

### Visual Indicators
- Orange/yellow badge for "New" submissions count
- Green checkmark for "Reviewed" status
- Gray styling for "Archived" items
- Timestamp showing when submitted (e.g., "2 hours ago")
- Photo thumbnails with click-to-enlarge
