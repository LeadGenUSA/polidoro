
## Add Required Field Indicator Text

Add a simple text note "* = Required" above the survey form to indicate which fields are mandatory.

### Change Summary

**File: `src/pages/CustomerSurveyForm.tsx`**

Add a paragraph element between the promotional box and the form (after line 163, before line 165):

```tsx
<p className="text-muted-foreground mb-4">* = Required</p>
```

This will display the required field indicator in regular, muted text directly above the form as requested.
