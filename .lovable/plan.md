

## Add Cloudflare Turnstile to All Public Forms

Cloudflare Turnstile is a free, privacy-friendly alternative to CAPTCHA that protects forms from bots. This plan adds it to all 6 public-facing forms with both client-side and server-side verification.

### Setup Required

You will need a **Turnstile Site Key** and **Secret Key** from Cloudflare:
1. Go to [Cloudflare Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile) and create a widget
2. Add your domain (polidoro.lovable.app) to the allowed hostnames
3. You will get a **Site Key** (public, used in the browser) and a **Secret Key** (private, used server-side)

The Site Key will be stored in the codebase (it is public/safe). The Secret Key will be stored as a backend secret called `TURNSTILE_SECRET_KEY`.

---

### Forms to Protect (6 total)

| Form | File | Edge Function |
|------|------|---------------|
| Homepage Contact | `src/components/Contact.tsx` | `send-contact-form` |
| Contact Us Page | `src/components/ContactForm.tsx` | `send-contact-form` |
| Free Estimate | `src/pages/FreeEstimateForm.tsx` | `send-estimate-form` |
| Work Order | `src/pages/WorkOrderForm.tsx` | `send-work-order` |
| Customer Survey | `src/pages/CustomerSurveyForm.tsx` | `send-customer-survey` |
| Review Submission | `src/pages/TestimonialsPage.tsx` | `submit-review` |
| Admin Login | `src/pages/AdminLogin.tsx` | N/A (auth, not edge function) |

---

### Implementation Steps

#### 1. Install the React Turnstile package
Add `@marsidev/react-turnstile` as a dependency.

#### 2. Create a shared Turnstile wrapper component
**New file:** `src/components/TurnstileWidget.tsx`

A reusable component that renders the Turnstile widget and provides the verification token via a callback. It will store the site key in one place.

#### 3. Add Turnstile widget to each form (client-side)
For each of the 6 forms listed above:
- Import and render `<TurnstileWidget>` inside the form, just above the submit button
- Store the Turnstile token in component state
- Disable the submit button until a valid token is received
- Pass the `turnstileToken` along with the form data to the edge function

#### 4. Create a shared Turnstile verification utility for edge functions
**New file:** `supabase/functions/_shared/verify-turnstile.ts`

A helper function that calls the Cloudflare `siteverify` API using the `TURNSTILE_SECRET_KEY` secret to validate the token server-side.

#### 5. Add server-side verification to each edge function
For each of the 5 edge functions (`send-contact-form`, `send-estimate-form`, `send-work-order`, `send-customer-survey`, `submit-review`):
- Extract the `turnstileToken` from the request body
- Call the shared verification function
- Return a 400 error if verification fails
- Continue processing if verification succeeds

#### 6. Admin Login (special case)
The admin login uses Supabase Auth directly (not an edge function). Turnstile will be added client-side only for bot deterrence -- the token will be verified before calling `signIn`/`signUp` by making a lightweight edge function call or by adding a small `verify-turnstile` edge function.

---

### Technical Details

**Client-side pattern (per form):**
```tsx
const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

// In the form, above the submit button:
<TurnstileWidget onVerify={setTurnstileToken} />

// In the submit handler, include the token:
body: { ...formData, turnstileToken }

// Disable submit until token is ready:
disabled={isSubmitting || !turnstileToken}
```

**Server-side pattern (per edge function):**
```typescript
const { turnstileToken, ...formData } = await req.json();

// Verify Turnstile token
const isValid = await verifyTurnstile(turnstileToken);
if (!isValid) {
  return new Response(JSON.stringify({ error: 'Bot verification failed' }), {
    status: 400, headers: corsHeaders
  });
}
```

**New backend secret needed:** `TURNSTILE_SECRET_KEY`

