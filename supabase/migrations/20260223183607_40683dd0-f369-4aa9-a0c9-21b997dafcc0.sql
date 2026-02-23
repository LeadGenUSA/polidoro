CREATE UNIQUE INDEX IF NOT EXISTS reviews_google_review_id_unique
ON public.reviews (google_review_id)
WHERE google_review_id IS NOT NULL;