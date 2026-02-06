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

-- Admin-only policies for estimate_submissions
CREATE POLICY "Admins can manage estimate submissions"
  ON estimate_submissions FOR ALL
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- Admin-only policies for work_order_submissions
CREATE POLICY "Admins can manage work order submissions"
  ON work_order_submissions FOR ALL
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- Admin-only policies for survey_submissions
CREATE POLICY "Admins can manage survey submissions"
  ON survey_submissions FOR ALL
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));