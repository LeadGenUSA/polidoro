
-- Create sitemap storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('sitemap', 'sitemap', true);

-- Allow public read access
CREATE POLICY "Public read access for sitemap"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'sitemap');

-- Allow authenticated admins to upload/update/delete
CREATE POLICY "Admin upload access for sitemap"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'sitemap'
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admin update access for sitemap"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'sitemap'
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admin delete access for sitemap"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'sitemap'
  AND public.has_role(auth.uid(), 'admin')
);
