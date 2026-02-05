-- Create gallery_items table
CREATE TABLE public.gallery_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  caption TEXT,
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view active gallery items" 
ON public.gallery_items 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage gallery items" 
ON public.gallery_items 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_gallery_items_updated_at
BEFORE UPDATE ON public.gallery_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for gallery images
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true);

-- Create storage policies for gallery bucket
CREATE POLICY "Gallery images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'gallery');

CREATE POLICY "Admins can upload gallery images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'gallery' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update gallery images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'gallery' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete gallery images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'gallery' AND has_role(auth.uid(), 'admin'::app_role));