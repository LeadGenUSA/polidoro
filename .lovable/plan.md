

## Track Real Lead Conversions After Confirmed Email Send

### Overview
Fire GA4 `lead_submit` and Google Ads `conversion` events on the frontend **only** after the backend confirms the Resend email was successfully sent. The backend already returns `{ success: true }` only after `sendEmail()` succeeds, so no backend changes are needed.

### What Changes

**5 frontend files** get `gtag()` calls added right before the success UI is shown:

1. **`src/components/Contact.tsx`** — Homepage contact form
2. **`src/components/ContactForm.tsx`** — Contact Us page form
3. **`src/pages/FreeEstimateForm.tsx`** — Free estimate form
4. **`src/pages/WorkOrderForm.tsx`** — Work order form
5. **`src/pages/CustomerSurveyForm.tsx`** — Customer survey form

### What Gets Added (same pattern in each file)

After `if (error) throw error;` and before the success state update, add:

```typescript
// Fire GA4 lead event
if (typeof window.gtag === 'function') {
  window.gtag('event', 'lead_submit', {
    event_category: 'lead',
    event_label: 'contact_form', // varies per form
    value: 1,
  });
}

// Fire Google Ads conversion
if (typeof window.gtag === 'function') {
  window.gtag('event', 'conversion', {
    send_to: 'AW-17977213592',
  });
}
```

Each form gets a unique `event_label` so you can distinguish lead sources in GA4:
- `contact_form` (Contact.tsx and ContactForm.tsx)
- `free_estimate` (FreeEstimateForm.tsx)
- `work_order` (WorkOrderForm.tsx)
- `customer_survey` (CustomerSurveyForm.tsx)

### TypeScript
A `window.gtag` type declaration will be added to `src/vite-env.d.ts` to avoid TS errors.

### Google Ads Conversion Label
You provided `AW-17977213592` as the tag ID. Once you create a specific conversion action in Google Ads (Tools → Conversions → New), you'll get a label like `AW-17977213592/AbCdEfGh`. I'll use just the tag ID for now — you can update the `send_to` value later with the full label.

### No Backend Changes Needed
The edge functions already return `{ success: true }` only after `sendEmail()` completes successfully. If Resend fails, it throws an error which results in a 500 response, and `supabase.functions.invoke` returns that as an error — so the gtag calls never fire on failure.

