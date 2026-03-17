

## Three Changes to Work Order Form

### File: `src/pages/WorkOrderForm.tsx`

**1. Add "Calendar Info" textbox under Customer Info section**
- Add a new field `calendarInfo` to the Zod schema as `z.string().max(500).optional()`
- Add a full-width textarea field after the `emailTo` field (after line 212), labeled "Calendar Info"
- Use a standard `Textarea` component for this field

**2. Rename "Email (for our records)" to "Customer Email"**
- Line 204: Change the label text from `Email (for our records)` to `Customer Email`

**3. Add "Boiler Type" dropdown under Job Detail**
- Add `boilerType` to the Zod schema as `z.string().optional()`
- Add a `Select` dropdown after the Job Detail `CardHeader` (before the Error Code field, around line 222) with these options:
  - Navien, BOSCH, Burnham, Weil McLain, Plumbing repair, Heating Repair, Other
- Use the existing shadcn `Select` component (`SelectTrigger`, `SelectContent`, `SelectItem`)
- Wire it up with `setValue('boilerType', value)` since react-hook-form `register` doesn't work directly with radix Select

All three new fields are optional and will be passed through to the edge function in the existing `...data` spread. No database migration needed since these are informational fields included in the email body. The edge function and email template will need a minor update to include `calendarInfo` and `boilerType` in the email output.

### File: `supabase/functions/send-work-order/index.ts`
- Add `calendarInfo` and `boilerType` to the `WorkOrderData` interface
- Include them in the email HTML template (Calendar Info under Customer Info section, Boiler Type under Job Detail section)

