

## Add Blog Ping Notifications on Publish

### Why This Matters

Search engines can take days or weeks to discover new content through regular crawling. Pinging services like Google, Bing (IndexNow), and other aggregators immediately notifies them that new content exists, leading to faster indexing and visibility in search results.

### What Will Be Added

A new backend function called `ping-blog-post` that sends notifications to search engine ping services whenever a blog post is published. It will be triggered automatically in two places:

1. When an admin approves/publishes a post via the Blog Manager
2. When the AI auto-generates a post (if auto-publish is ever enabled)

### Ping Targets

- **IndexNow** (covers Bing, Yandex, Seznam, Naver) -- single API call notifies multiple engines
- **Google Ping** (sitemaps ping endpoint: `https://www.google.com/ping?sitemap=...`)

### Implementation Details

**1. New backend function: `supabase/functions/ping-blog-post/index.ts`**

Accepts a blog post slug, constructs the full URL, and sends pings:

- IndexNow API: `POST https://api.indexnow.org/indexnow` with the post URL and a site-owned key file
- Google sitemap ping: `GET https://www.google.com/ping?sitemap=https://www.bigcityplumbing.com/sitemap.xml`

Logs results for debugging.

**2. New file: `public/indexnow-key.txt`**

A simple text file containing the IndexNow verification key (a random hex string). This file must be publicly accessible at the site root for IndexNow to verify ownership.

**3. Update `supabase/config.toml`**

Add the new function entry with `verify_jwt = false`.

**4. Update `src/components/admin/BlogPostEditor.tsx`**

After a post status is set to `published`, call the ping function with the post's slug.

**5. Update `supabase/functions/generate-blog-post/index.ts`**

Add an optional ping call after post creation (currently posts are created as drafts, so pinging would only occur if the status were changed to published).

### Flow

```text
Admin clicks "Approve & Publish"
       |
       v
BlogPostEditor saves status = 'published'
       |
       v
Calls ping-blog-post function with slug
       |
       +---> IndexNow API (Bing, Yandex, etc.)
       +---> Google sitemap ping
```

### Files Changed

| File | Change |
|---|---|
| `supabase/functions/ping-blog-post/index.ts` | New function -- sends pings to IndexNow and Google |
| `public/indexnow-key.txt` | New file -- IndexNow ownership verification key |
| `supabase/config.toml` | Add `[functions.ping-blog-post]` entry |
| `src/components/admin/BlogPostEditor.tsx` | Call ping function after publishing |

