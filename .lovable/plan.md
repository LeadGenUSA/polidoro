

# Update SMTP_PORT Secret

## Change

Update the `SMTP_PORT` secret value to `465`.

This is the standard port for SMTP over SSL/TLS, which matches the current code configuration (all edge functions default to port 465 with `tls: true`).

No code changes needed -- only the secret value update.

