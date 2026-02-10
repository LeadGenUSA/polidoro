
## Add Thank You Modal After Contact Form Submission

### What Changes
After a successful form submission on the homepage Contact section, a modal dialog will appear thanking the customer instead of just showing a small toast notification.

### Modal Content
- A checkmark icon for visual confirmation
- **"Thank You!"** heading
- Message: "We will get back to you as soon as possible with your free estimation quote."
- A note about expected response time: "Our team typically responds within 24 hours. For urgent matters, please call us directly."
- Phone numbers for immediate contact: 631-361-9500 (LI) / 718-326-5833 (NYC)
- A "Close" button to dismiss the modal

### Technical Details

**File: `src/components/Contact.tsx`**
- Import `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription` from the existing UI dialog component
- Add a `showThankYou` state (boolean, default `false`)
- On successful submission, set `showThankYou` to `true` (replacing the current toast notification)
- Render a `Dialog` with the thank you content, controlled by `showThankYou`
- When the dialog closes, reset the state

No new files, dependencies, or database changes needed -- this uses the existing Radix dialog component already in the project.
