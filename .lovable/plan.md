

## Update SMTP Settings

Updating `SMTP_HOST` and `SMTP_PORT` to resolve the "invalid peer certificate: NotValidForName" error.

### Background

The current error happens because the hostname you're connecting to doesn't match the SSL certificate on the mail server. This is common with shared hosting like Hostgator.

### What to enter

- **SMTP_HOST**: Use the actual server hostname from your Hostgator cPanel (look under Email Accounts > SMTP settings). It might be something like `mail.bigcityplumbing.com` or a `gatorXXXX.hostgator.com` hostname.
- **SMTP_PORT**: Typically `465` for SSL or `587` for STARTTLS. Port `465` is recommended since STARTTLS has issues in the edge runtime.

### Steps

1. Update the `SMTP_HOST` secret with the correct hostname
2. Update the `SMTP_PORT` secret if needed
3. Test the contact form to verify emails send successfully

### Alternative

If SMTP continues to have certificate issues, switching to the **Resend API** (already configured with a key) would be the most reliable approach for sending emails from backend functions.
