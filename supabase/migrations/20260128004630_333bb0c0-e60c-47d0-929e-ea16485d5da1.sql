-- Remove the overly permissive policy since we're using service role in the edge function
DROP POLICY IF EXISTS "Service role can insert reviews" ON public.reviews;