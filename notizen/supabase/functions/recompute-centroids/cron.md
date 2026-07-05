# Nächtlicher Cron

Diese Function per `pg_cron` + `pg_net` (beide in Supabase aktivierbar) einmal
täglich aufrufen, z.B. via SQL:

```sql
select cron.schedule(
  'recompute-folder-centroids-nightly',
  '0 3 * * *',
  $$
  select net.http_post(
    url := 'https://<project-ref>.supabase.co/functions/v1/recompute-centroids',
    headers := jsonb_build_object('Authorization', 'Bearer <service-role-key>')
  );
  $$
);
```

Alternativ: ein externer Scheduler (z.B. GitHub Actions Cron) der diese
Function einmal täglich per HTTP POST aufruft.
