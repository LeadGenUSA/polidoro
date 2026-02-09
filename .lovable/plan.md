

# Allow Admin to Change Blog Featured Image

## Overview
Add an image upload/replace capability to the Blog Post Editor so admins can swap out the AI-generated featured image with their own.

## What Changes

### `src/components/admin/BlogPostEditor.tsx`
- Add state for `featuredImageUrl` initialized from `post.featured_image_url`
- Add a hidden file input and a "Change Image" button overlaying the current image
- On file select, upload to the existing `blog-images` storage bucket, then update the local state
- Include `featured_image_url` in the save/approve payloads so the new image persists
- If no image exists yet, show an "Add Image" button instead
- Add a "Remove Image" option

### Upload Logic
- Reuse the same pattern from existing photo upload components (validate type, validate 5MB max, upload to `blog-images` bucket via Supabase Storage)
- Generate a unique filename with timestamp + random string
- Get the public URL after upload

### No database or backend changes needed
The `blog_posts` table already has a `featured_image_url` column, and the `blog-images` storage bucket already exists and is public. The `updatePost` function in `useBlogPosts` already supports partial updates including this field.

## Technical Details

The editor currently displays the image as read-only. The changes will:

1. Track `featuredImageUrl` in state (like `title`, `content`, etc.)
2. Add a file input that uploads to `blog-images` bucket
3. Show the current image with overlay buttons: "Change" and "Remove"
4. If no image, show an upload area
5. Pass `featured_image_url: featuredImageUrl` in `handleSave` and `handleApprove` calls

