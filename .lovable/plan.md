# Make photos optional on the Work Order form

Right now the Work Order form blocks submission with a "Photos required" error when no photo or video is attached. This makes attachments optional, matching the Free Estimate form.

## Changes

- `src/pages/WorkOrderForm.tsx`: remove the pre-submit check that rejects submissions with zero photos, so the form submits with an empty photo list.
- `src/components/work-order/PhotoUpload.tsx`: label the section "Photos (optional)" and note in the helper text that attachments are optional.

Everything else stays the same: still up to 10 files, 25MB per image, 20MB per video, and the same supported formats. The work order email/record simply shows no attachments when none are added.
