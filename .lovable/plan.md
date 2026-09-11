# Move the expand arrow to the left on Work Order entries

## What changes

On each work order entry in the admin submissions list (New, Reviewed, Archived, and All), the small arrow button that opens and closes the entry currently sits at the far right of the row. It will move to the far left, before the status label and customer name.

Everything else stays the same: same arrow, same click behavior, same up/down direction when open or closed. Only work order entries are affected — estimates and surveys keep their current layout.

## Technical detail

In `src/components/admin/WorkOrderSubmissionCard.tsx`, inside `CardHeader`, move the `CollapsibleTrigger` block from after the content `div` to before it, and adjust the wrapper row to keep the trigger vertically aligned at the top with a small right margin.
