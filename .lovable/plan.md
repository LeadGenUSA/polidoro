

## Set Up Weekly Cron Job for Automatic Blog Generation

### What This Does
A scheduled database job will automatically call the `check-blog-schedule` function once per week. That function checks if it's time to generate a post (based on your frequency setting), and if so, triggers `generate-blog-post` which pulls the next topic from your queue.

### Technical Steps

1. **Enable `pg_cron` and `pg_net` extensions** via a database migration
2. **Create a weekly cron job** that calls the `check-blog-schedule` edge function every Monday at 9:00 AM UTC
   - Uses `net.http_post` to invoke the function URL with the anon key
   - The function itself checks the frequency setting, so even though the cron runs weekly, it will only generate a post when the interval has elapsed

### Implementation
A single SQL statement run via the database insert tool (not migration, since it contains project-specific URLs and keys):

```sql
-- Enable extensions
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Schedule: every Monday at 9 AM UTC
SELECT cron.schedule(
  'weekly-blog-check',
  '0 9 * * 1',
  $$
  SELECT net.http_post(
    url:='https://wjaulyvqzywcnkegnzoh.supabase.co/functions/v1/check-blog-schedule',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqYXVseXZxenl3Y25rZWduem9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NTYzODUsImV4cCI6MjA4NTEzMjM4NX0.qlt8PJNz2KCp4d1-JyMP2eymvUy_hyBVpQDHfIZwfnI"}'::jsonb,
    body:='{"time": "scheduled"}'::jsonb
  ) AS request_id;
  $$
);
```

No code file changes needed — just a one-time database setup.

