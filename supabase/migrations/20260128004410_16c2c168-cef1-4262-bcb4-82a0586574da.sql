-- Allow the edge function (using service role) to insert reviews
-- This policy allows insert when there's no authenticated user (service role context)
CREATE POLICY "Service role can insert reviews"
ON public.reviews FOR INSERT
WITH CHECK (true);

-- Update the existing admin insert policy to only apply to authenticated admins
DROP POLICY IF EXISTS "Admins can insert reviews" ON public.reviews;
CREATE POLICY "Admins can insert reviews"
ON public.reviews FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));