

## Switch All Email Sending from SMTP to Resend API

Replace the SMTP/denomailer integration with the Resend HTTP API across all 5 edge functions to permanently resolve the SSL certificate errors.

### Why Resend?

- No TLS/certificate issues -- it's a simple HTTP API call
- The `RESEND_API_KEY` secret is already configured
- More reliable from edge function environments than SMTP connections
- No dependency on `denomailer` library

### Important: Sender Domain

Resend requires a verified sending domain. You'll need to verify `bigcityplumbing.com` in your Resend dashboard (add DNS records). Until then, you can use Resend's default `onboarding@resend.dev` as the "from" address for testing.

### Functions to Update (5 total)

1. **send-contact-form/index.ts** -- Contact page submissions to mike@bigcityplumbing.com
2. **send-work-order/index.ts** -- Work order submissions to mike, diane, info + optional emailTo
3. **send-estimate-form/index.ts** -- Estimate form submissions to mike@bigcityplumbing.com
4. **send-customer-survey/index.ts** -- Customer survey submissions to mike@bigcityplumbing.com
5. **submit-review/index.ts** -- Admin notification for new reviews to mike@bigcityplumbing.com

### Shared Helper

Create a reusable email helper in `supabase/functions/_shared/send-email.ts`:

```typescript
export async function sendEmail(options: {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
  from?: string;
}) {
  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY is not configured");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: options.from || "Big City Plumbing <noreply@bigcityplumbing.com>",
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      html: options.html,
      reply_to: options.replyTo,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend API error [${res.status}]: ${err}`);
  }

  return await res.json();
}
```

### Changes Per Function

For each of the 5 functions:
- Remove the `denomailer` import
- Remove all SMTP client creation and connection code
- Remove SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS references
- Import and call the shared `sendEmail()` helper instead
- Keep all existing HTML email templates, database saves, and Turnstile verification unchanged

### Technical Details

- The `compactEmailHtml()` utility will be kept in each function (it's still useful for clean HTML)
- The `replyTo` field (used in contact form, estimate, survey) maps to Resend's `reply_to` parameter
- Work order's multi-recipient list maps to Resend's `to` array
- No code changes needed on the frontend -- only backend functions change

