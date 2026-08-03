ALTER TABLE public.work_order_submissions
  ALTER COLUMN customer_name DROP NOT NULL,
  ALTER COLUMN street_address DROP NOT NULL,
  ALTER COLUMN phone DROP NOT NULL,
  ALTER COLUMN zip_code DROP NOT NULL,
  ALTER COLUMN email DROP NOT NULL,
  ALTER COLUMN job_description DROP NOT NULL;