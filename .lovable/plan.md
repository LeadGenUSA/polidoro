

# AI-Powered Monthly Blog System with Admin Management (Updated)

## Overview
Build a complete blog system that automatically generates SEO-optimized plumbing articles on a configurable schedule using AI, stores them for admin review, and publishes approved posts with AI-generated images. Admins can change the generation frequency and specify topics for the next post.

## How It Works for You

1. **On your chosen schedule** (weekly, bi-weekly, monthly, or quarterly), the system automatically generates a new blog post based on seasonal plumbing topics relevant to Nassau County, Suffolk County, and NYC
2. **You can change the frequency** at any time from the admin dashboard
3. **You can request a specific topic** -- type in what the next post should cover, and the AI will write about that instead of choosing automatically
4. **You review the post** in the admin dashboard -- edit the title, content, or any section, then approve or reject it
5. **Once approved**, the post goes live on the public `/blog` page with an AI-generated image
6. **Full editorial control** -- nothing publishes without your approval

---

## What Gets Built

### 1. Database

**`blog_posts` table** -- stores all posts:
- Title, slug, meta description, full content (Markdown)
- Featured image URL
- Status: `draft`, `published`, `rejected`
- FAQs (JSON), publish date, timestamps

**`blog_settings` table** -- stores admin preferences:
- `generation_frequency`: one of `weekly`, `biweekly`, `monthly`, `quarterly`
- `next_topic`: optional text field where admin can specify the next blog topic
- `last_generated_at`: timestamp to calculate when the next post is due

New enum: `blog_post_status` (`draft`, `published`, `rejected`)
New enum: `blog_generation_frequency` (`weekly`, `biweekly`, `monthly`, `quarterly`)

RLS policies:
- Anyone can read published blog posts
- Only admins can manage posts and settings

### 2. Storage
- `blog-images` bucket (public) for AI-generated featured images

### 3. Backend Function: `generate-blog-post`
A backend function that:
- Checks `blog_settings` for a requested topic; if set, uses that topic and clears the field after generation
- If no topic is specified, determines the current season and selects a relevant plumbing topic for Long Island/NYC
- Uses Lovable AI to write a full SEO/AEO/GEO-optimized article (direct answer block, local context, FAQs, expert voice, soft CTA)
- Uses Lovable AI image generation to create a context-relevant featured image
- Saves the draft post and image to the database
- Can be triggered manually or by the scheduled job

### 4. Scheduled Job: `check-blog-schedule`
A lightweight backend function that runs daily and checks:
- What is the configured frequency?
- When was the last post generated?
- Is it time to generate a new one?

If yes, it calls the generation logic. This approach means changing the frequency in the admin UI takes effect immediately without needing to modify any cron job -- the cron runs daily but only triggers generation when the interval has elapsed.

A `pg_cron` job calls this function once per day.

### 5. Admin Dashboard: Blog Manager
A new "Blog" tab in the admin dashboard with:

**Settings Panel (top of section):**
- Frequency selector dropdown: Weekly / Bi-weekly / Monthly / Quarterly
- "Next Topic" text input with a save button -- type a topic like "sump pump maintenance for spring" and the next auto-generated post will cover it
- "Generate Now" button to trigger a post on demand

**Stats cards:** Draft / Published / Rejected counts

**Post list with filter tabs:** Draft / Published / Rejected / All

**Post editor (click into any post):**
- Edit title, content (textarea), meta description, FAQs
- Preview the featured image
- Approve, Reject, or Delete actions

### 6. Public Blog Pages
- **`/blog`** -- index page listing published posts as cards with image, title, excerpt, date
- **`/blog/:slug`** -- individual post with clean typography, FAQ accordion, featured image, soft CTA

### 7. Navigation Updates
- Add "Blog" to main navigation (desktop and mobile)
- Add "Blog" to Footer quick links

---

## Content Generation Details

Each AI-generated post follows this structure:
- **Direct Answer Block** (40-70 words) -- quotable by AI engines
- **Expanded Explanation** -- causes, risks, outcomes in plain language
- **Local Authority Context** -- Long Island/NYC specific (weather, housing, water systems)
- **Homeowner Guidance** -- safe DIY checks vs. when to call a licensed plumber
- **Expert Voice** -- "From a Long Island plumber's perspective..."
- **5 FAQs** -- standalone Q&A pairs for voice search and snippets
- **Soft CTA** -- helpful closing encouraging local contact

When no topic is specified, seasonal rotation applies:
- **Winter:** frozen pipes, boiler breakdowns, heating efficiency
- **Spring:** sump pump prep, water heater maintenance, drain clearing
- **Summer:** sewer line issues, outdoor plumbing, water conservation
- **Fall:** heating tune-ups, radiator bleeding, winterization

---

## Technical Details

### New Database Objects

```text
-- Enum types
blog_post_status: draft, published, rejected
blog_generation_frequency: weekly, biweekly, monthly, quarterly

-- blog_posts table
id (uuid PK), title, slug (unique), meta_description, content,
featured_image_url, status, faqs (jsonb), published_at,
created_at, updated_at

-- blog_settings table (single-row config)
id (uuid PK), generation_frequency (default 'monthly'),
next_topic (nullable text), last_generated_at (timestamptz),
updated_at
```

### New Storage Bucket
- `blog-images` (public)

### New Backend Functions
- `supabase/functions/generate-blog-post/index.ts` -- AI content + image generation, reads/clears next_topic from settings
- `supabase/functions/check-blog-schedule/index.ts` -- daily check: compares frequency setting against last_generated_at, triggers generation if due

### New Frontend Files
- `src/pages/Blog.tsx` -- public blog index
- `src/pages/BlogPost.tsx` -- individual post page
- `src/components/admin/BlogManager.tsx` -- admin blog section with settings panel, stats, post list
- `src/components/admin/BlogPostEditor.tsx` -- edit/preview/approve component
- `src/components/admin/BlogSettings.tsx` -- frequency selector and next-topic input
- `src/hooks/useBlogPosts.tsx` -- data fetching and mutations
- `src/hooks/useBlogSettings.tsx` -- settings fetch and update

### Modified Files
- `src/App.tsx` -- add `/blog` and `/blog/:slug` routes
- `src/pages/Admin.tsx` -- add "Blog" section button with draft count badge, render BlogManager
- `src/components/Navbar.tsx` -- add "Blog" to navLinks
- `src/components/Footer.tsx` -- add "Blog" to Quick Links
- `supabase/config.toml` -- register both new functions

### Cron Job
A daily `pg_cron` + `pg_net` job that calls `check-blog-schedule`. The function itself decides whether to generate based on the admin's chosen frequency, so changing the dropdown in the UI is all that's needed to adjust the schedule.

