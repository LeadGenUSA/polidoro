
-- 1. Fix blog-images RLS: require admin for INSERT/DELETE (existing policies missed the has_role check)
DROP POLICY IF EXISTS "Admins can upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete blog images" ON storage.objects;

CREATE POLICY "Admins can upload blog images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'blog-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete blog images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'blog-images' AND public.has_role(auth.uid(), 'admin'));

-- 2. Prevent anonymous LISTING of files in public buckets.
-- Public URLs still work (they bypass RLS on storage.objects); only the list() API is blocked.
DROP POLICY IF EXISTS "Anyone can view slideshow files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view work order photos" ON storage.objects;
DROP POLICY IF EXISTS "Blog images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Gallery images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Public can view estimate photos" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for sitemap" ON storage.objects;

CREATE POLICY "Admins can list slideshow files"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'slideshow' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can list work order photos"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'work-order-photos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can list blog images"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'blog-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can list gallery files"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'gallery' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can list estimate photos"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'estimate-photos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can list sitemap files"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'sitemap' AND public.has_role(auth.uid(), 'admin'));

-- 3. Revoke EXECUTE on internal trigger SECURITY DEFINER functions
-- These are only invoked via triggers; no application code should call them.
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.prevent_last_admin_deletion() FROM PUBLIC, anon, authenticated;
