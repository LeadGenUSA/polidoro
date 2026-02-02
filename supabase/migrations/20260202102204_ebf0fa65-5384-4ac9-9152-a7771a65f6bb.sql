-- Add overlay_title column to slideshow_items table
ALTER TABLE public.slideshow_items 
ADD COLUMN overlay_title text DEFAULT NULL;