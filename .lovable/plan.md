

## Make Customer Info Fields Optional

### Change in `src/pages/WorkOrderForm.tsx`

Update the Zod schema (lines 24-29) to make these 5 fields optional:

- `customerName` → `.string().max(100).optional()`
- `streetAddress` → `.string().max(200).optional()`
- `phone` → `.string().max(20).optional()`
- `zipCode` → `.string().max(10).optional()`
- `email` → `.string().email().max(100).optional().or(z.literal(''))`

No other file changes needed — the edge function already handles these as potentially empty values, and the database columns are nullable or will accept empty strings.

