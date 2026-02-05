-- Add is_default_first column to slideshow_items table
ALTER TABLE slideshow_items 
ADD COLUMN is_default_first BOOLEAN NOT NULL DEFAULT false;