-- Add link URL column to slideshow_items
ALTER TABLE public.slideshow_items 
ADD COLUMN link_url TEXT;