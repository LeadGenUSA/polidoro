

## Plan: Add Sitemap Upload Button

### Problem
Currently the admin can download the generated sitemap XML, but then has to manually commit it to the repo. The user wants a one-click way to upload/replace the sitemap.

### Approach
Store the sitemap in a public storage bucket so it's always accessible at a stable URL. Add an upload button next to the existing download button.

### Changes

**1. Database migration — create `sitemap` storage bucket**
- Create a public `sitemap` bucket
- RLS policy: anyone can read, only authenticated admins can upload/update

**2. New edge function: `serve-sitemap/index.ts`**
- Serves the `sitemap.xml` file from the `sitemap` storage bucket
- Returns `Content-Type: application/xml`
- Falls back to generating dynamically if no uploaded file exists (calls existing generate-sitemap logic)
- Public endpoint (no JWT)

**3. Update `SitemapRegenerateButton.tsx`**
- Add a second button "Upload Sitemap" below the download button
- Flow: calls generate-sitemap edge function → takes the XML response → uploads it to `sitemap` storage bucket as `sitemap.xml` (replacing any existing file)
- Also allow manual file upload via a hidden file input if the admin wants to upload a custom XML
- Show success/error toasts

**4. Update `robots.txt`**
- Point `Sitemap:` to the serve-sitemap edge function URL... 

Wait — this has the same domain problem. The storage URL and edge function URL are both on the supabase domain, not `bigcityplumbing.com`.

### Revised Approach
Since the sitemap must live at `bigcityplumbing.com/sitemap.xml` for GSC, and `public/sitemap.xml` is baked at build time, the only way to dynamically update it is:

1. **Auto-generate + auto-commit**: Not possible in Lovable's static hosting model
2. **Store in bucket + serve via edge function**: Same domain mismatch issue

The most practical solution is to **streamline the existing download workflow**: instead of two steps (download then manually replace), make one button that generates the sitemap and immediately downloads it. The admin then drags it into the Lovable file tree to replace `public/sitemap.xml`.

**OR** — we can add a "Generate & Save" button that:
- Calls the generate-sitemap edge function
- Saves the result to a `sitemap` storage bucket  
- The admin then updates `robots.txt` to point to the bucket's public URL

But this still won't work for GSC since the URL won't be on the verified domain.

### Final Practical Plan

The most useful addition given the constraints: **Add a "Regenerate Sitemap" button that calls the edge function, gets the XML, and directly overwrites `public/sitemap.xml` content in the project by downloading it for the user.** This is essentially what already exists.

What the user likely wants is to avoid the manual step entirely. The best we can do:

**1. Modify `SitemapRegenerateButton` to add a second "Auto-Update" button**
- Generates sitemap from edge function
- Uploads to a public `sitemap` storage bucket as `sitemap.xml`
- The bucket URL can serve as a secondary sitemap source

**2. Create `sitemap` storage bucket** (migration)

**3. Update `supabase/config.toml`** — add `serve-sitemap` function config

**4. Create `serve-sitemap` edge function** — proxy that reads from storage bucket and serves with correct content type and CORS

**5. Keep `robots.txt` pointing to `/sitemap.xml`** — the static file remains the primary for GSC

This gives the admin two options: download the file to replace manually, or save it to cloud storage for a live URL they can submit as an additional sitemap in GSC.

### Files to change

| File | Change |
|------|--------|
| Migration SQL | Create `sitemap` public storage bucket + RLS policies |
| `supabase/functions/serve-sitemap/index.ts` | New — serves sitemap.xml from storage bucket |
| `supabase/config.toml` | Add `serve-sitemap` with `verify_jwt = false` |
| `src/components/admin/SitemapRegenerateButton.tsx` | Add "Generate & Upload" button that saves to storage bucket |

