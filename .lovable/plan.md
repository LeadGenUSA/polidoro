

## Add Topic Queue for Blog Scheduling

### Problem
Currently, `blog_settings` only has a single `next_topic` text field. You can only set one topic at a time. You want to queue up 12 topics at once (for weekly generation over a quarter), then refill every quarter.

### Solution

**1. New `blog_topic_queue` table**
- Columns: `id`, `topic` (text), `queue_order` (integer), `status` (pending/used), `created_at`, `used_at`
- RLS: admin-only management, matching existing patterns
- Each row = one scheduled topic, processed in order

**2. Update `generate-blog-post` edge function**
- Instead of reading `blog_settings.next_topic`, query the first `pending` topic from `blog_topic_queue` ordered by `queue_order`
- After using it, mark it as `used` with a timestamp
- Fall back to random seasonal topic if the queue is empty

**3. Update `BlogSettings.tsx` admin UI**
- Replace the single "Next Topic" input with a **Topic Queue** section
- Show a numbered list of pending topics with drag-to-reorder or simple up/down controls
- Add an input to append new topics (one at a time or bulk-add with one per line via a textarea)
- Show count: "5 of 12 topics remaining"
- Allow removing individual topics from the queue

**4. New `useBlogTopicQueue` hook**
- CRUD operations for the `blog_topic_queue` table: fetch pending topics, add topics, remove topics, reorder

### Changes Summary

| Area | What changes |
|------|-------------|
| Database | New `blog_topic_queue` table with RLS |
| Edge function | `generate-blog-post` reads from queue first |
| Admin UI | Topic queue list with add/remove in `BlogSettings.tsx` |
| Hook | New `useBlogTopicQueue.tsx` |

The existing `next_topic` field on `blog_settings` can be deprecated (ignored) once the queue is in place. No other pages or public-facing behavior changes.

