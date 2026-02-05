-- Create storage bucket for estimate form photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('estimate-photos', 'estimate-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to estimate photos
CREATE POLICY "Public can view estimate photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'estimate-photos');

-- Allow anyone to upload estimate photos (public form)
CREATE POLICY "Anyone can upload estimate photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'estimate-photos');