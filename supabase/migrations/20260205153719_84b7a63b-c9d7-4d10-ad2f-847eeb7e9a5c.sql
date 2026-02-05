-- Create storage bucket for work order photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('work-order-photos', 'work-order-photos', true);

-- Allow anyone to upload work order photos
CREATE POLICY "Anyone can upload work order photos"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'work-order-photos');

-- Allow anyone to view work order photos
CREATE POLICY "Anyone can view work order photos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'work-order-photos');