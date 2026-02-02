
# Connect Contact Form to Email

## Overview
Make the homepage contact form send real emails to mike@bigcityph.com using the same Hostgator SMTP server already configured for Work Orders and Customer Surveys.

## Changes

### 1. Create New Backend Function
Create `supabase/functions/send-contact-form/index.ts`:
- Accept form data: name, email, phone, message
- Build professional HTML email template matching the site's styling
- Send via Hostgator SMTP (uses existing secrets: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS)
- Include sender's email as reply-to for easy response
- Apply same encoding fix to prevent "=20" artifacts

### 2. Update Contact Form Component
Modify `src/components/Contact.tsx`:
- Add loading state while sending
- Call the new backend function with form data
- Show success toast on completion
- Show error toast if sending fails
- Disable submit button during submission

## Technical Details

**Email Template Structure:**
- Header with "New Contact Form Submission" title
- Customer details table (Name, Email, Phone)
- Message section
- Footer noting it came from the website

**No new secrets needed** - reuses existing SMTP configuration already set up for other forms.
