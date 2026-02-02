-- Create slideshow_items table
CREATE TABLE public.slideshow_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  file_url TEXT NOT NULL,
  alt_text TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.slideshow_items ENABLE ROW LEVEL SECURITY;

-- Public can view active slideshow items
CREATE POLICY "Anyone can view active slideshow items"
ON public.slideshow_items
FOR SELECT
USING (is_active = true);

-- Admins can do everything
CREATE POLICY "Admins can manage slideshow items"
ON public.slideshow_items
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_slideshow_items_updated_at
BEFORE UPDATE ON public.slideshow_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for slideshow media
INSERT INTO storage.buckets (id, name, public) VALUES ('slideshow', 'slideshow', true);

-- Storage policies for slideshow bucket
CREATE POLICY "Anyone can view slideshow files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'slideshow');

CREATE POLICY "Admins can upload slideshow files"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'slideshow' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update slideshow files"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'slideshow' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete slideshow files"
ON storage.objects
FOR DELETE
USING (bucket_id = 'slideshow' AND has_role(auth.uid(), 'admin'::app_role));