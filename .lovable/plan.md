
## AI Spelling, Grammar, and "Make It Better" for Forms

### What Changes

Every free-text field on the Free Estimate, Work Order, and Customer Survey forms gets two AI features:

1. **Auto spell/grammar fix on blur** -- When the user clicks out of a text field, the text is silently sent to AI and corrected in place (spelling and grammar only, no content changes). A brief loading indicator shows during the check.

2. **"Make It Better" button** -- A small sparkle/wand icon button appears next to each text field. Clicking it sends the text to AI to rewrite it more clearly and professionally. The improved version is shown in a popover/inline preview where the user can **Accept** or **Dismiss**.

### Which Fields

- **Free Estimate Form**: Tank Notes, Chimney Lined Notes, Vent Location Notes, Gas Notes
- **Work Order Form**: Job Description, Recommendations
- **Customer Survey**: What Did We Do Well, How Can We Improve, Additional Comments

### How It Works

```
User types text --> Clicks away (blur)
                     |
                     v
              Auto spell/grammar fix
              (silent, replaces text in place)

User clicks sparkle icon --> "Make It Better"
                     |
                     v
              AI rewrites for clarity
              Shows suggestion with Accept / Dismiss
```

### Technical Details

**New file: `supabase/functions/check-spelling/index.ts`**
- A single backend function that accepts `{ text: string, mode: "fix" | "improve" }`
- `"fix"` mode: System prompt tells AI to only correct spelling and grammar, return the corrected text unchanged otherwise
- `"improve"` mode: System prompt tells AI to rewrite the text to be clearer, more professional, and well-structured while preserving the original meaning
- Uses Lovable AI (google/gemini-3-flash-preview), non-streaming since responses are short
- Handles 429/402 errors gracefully
- Returns `{ result: string }`

**Update: `supabase/config.toml`**
- Add `[functions.check-spelling]` with `verify_jwt = false`

**New file: `src/components/SmartTextarea.tsx`**
A wrapper component that combines a Textarea with both AI features. Props:
- `value`, `onChange` -- standard controlled input props
- `id`, `placeholder`, `rows` -- passed through to Textarea
- Includes:
  - **onBlur handler**: If text has 3+ words and has changed since last check, calls the edge function in `"fix"` mode and silently updates the value. Shows a subtle loading spinner on the field border while processing.
  - **"Make It Better" button**: A small button with a sparkle/wand icon (from lucide-react `Sparkles` or `Wand2`) positioned at the top-right of the textarea. Only visible when field has text. Clicking it calls the edge function in `"improve"` mode and shows the suggestion inline below the field with Accept and Dismiss buttons.
  - Tracks "last checked text" to avoid redundant blur calls
  - Shows a brief "Fixed!" or "No changes needed" toast-style indicator after blur corrections

**New file: `src/components/SmartInput.tsx`**
Same concept as SmartTextarea but wraps an Input component. Used for the shorter note fields (Chimney Lined Notes, Vent Location Notes) that use Input instead of Textarea.

**Modified files -- integration:**

- `src/pages/FreeEstimateForm.tsx`:
  - Replace `<Textarea>` for tankNotes and gasNotes with `<SmartTextarea>`
  - Replace `<Input>` for chimneyLinedNotes and ventLocationNotes with `<SmartInput>`

- `src/pages/WorkOrderForm.tsx`:
  - Replace `<Textarea>` for jobDescription and recommendations with `<SmartTextarea>`

- `src/pages/CustomerSurveyForm.tsx`:
  - Replace `<Textarea>` for whatDidWell, areasToImprove, and additionalComments with `<SmartTextarea>`

Each replacement is a direct swap -- same props, just a different component name. The Smart components handle all AI logic internally.
