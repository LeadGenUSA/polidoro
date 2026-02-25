## Work Order Form: Require Photos and Allow Videos

### Changes Overview

Three modifications to ensure work orders require at least one photo/video, accept MP4 video uploads, and display a warning message.

### 1. Add red bold warning text below "Photos" label

In the PhotoUpload component, add a red bold message immediately after the "Photos" label:  
**"Work orders will not upload without a picture or video attached."**

### 2. Accept MP4 video files in the upload

Update the file input `accept` attribute from `image/*` to `image/*,video/mp4` and adjust the file type validation to also allow `video/mp4` files.

### 3. Block form submission without at least one photo/video

Add a validation check in the `onSubmit` handler in `WorkOrderForm.tsx` that shows an error toast and prevents submission if `photos.length === 0`.

---

### Technical Details

**File: `src/components/work-order/PhotoUpload.tsx**`

- After the `<Label>Photos</Label>` line, add: `<p className="text-destructive font-bold text-sm">Work orders will not upload without a picture or video attached.</p>`
- Change `accept="image/*"` to `accept="image/*,video/mp4"`
- Update the file type validation check from `!file.type.startsWith('image/')` to `!file.type.startsWith('image/') && file.type !== 'video/mp4'`
- Update the helper text to mention MP4 video support

**File: `src/pages/WorkOrderForm.tsx**`

- In the `onSubmit` function, before setting `isSubmitting`, add a check: if `photos.length === 0`, show a destructive toast saying at least one photo is required and return early