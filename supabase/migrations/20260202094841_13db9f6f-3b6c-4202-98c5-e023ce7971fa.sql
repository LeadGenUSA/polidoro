-- Add duration and overlay text columns to slideshow_items
ALTER TABLE public.slideshow_items 
ADD COLUMN duration_seconds INTEGER NOT NULL DEFAULT 15,
ADD COLUMN overlay_text TEXT;