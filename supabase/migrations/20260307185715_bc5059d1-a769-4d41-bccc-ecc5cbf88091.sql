
-- Create topic queue status enum
CREATE TYPE public.topic_queue_status AS ENUM ('pending', 'used');

-- Create blog_topic_queue table
CREATE TABLE public.blog_topic_queue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  topic TEXT NOT NULL,
  queue_order INTEGER NOT NULL DEFAULT 0,
  status topic_queue_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  used_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.blog_topic_queue ENABLE ROW LEVEL SECURITY;

-- Admin-only management
CREATE POLICY "Admins can manage topic queue"
  ON public.blog_topic_queue
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
