select cron.unschedule(2);
select cron.unschedule(1);
select cron.schedule(
  'check-blog-schedule-daily',
  '0 14 * * *',
  $$
  select net.http_post(
    url := 'https://wjaulyvqzywcnkegnzoh.supabase.co/functions/v1/check-blog-schedule',
    headers := '{"Content-Type": "application/json", "x-cron-secret": "71cc6e7724244d421e30f7cc9be25260ddc07d0c7a71b94d"}'::jsonb,
    body := '{}'::jsonb
  ) as request_id;
  $$
);