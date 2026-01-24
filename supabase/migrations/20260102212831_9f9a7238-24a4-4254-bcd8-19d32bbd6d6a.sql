-- Create support_inquiries table
CREATE TABLE public.support_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.support_inquiries ENABLE ROW LEVEL SECURITY;

-- Anyone can submit inquiries
CREATE POLICY "Anyone can create inquiries"
ON public.support_inquiries
FOR INSERT
WITH CHECK (true);

-- Users can view their own inquiries
CREATE POLICY "Users can view their own inquiries"
ON public.support_inquiries
FOR SELECT
USING (auth.uid() = user_id);

-- Admins can view and update all inquiries
CREATE POLICY "Admins can view all inquiries"
ON public.support_inquiries
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update inquiries"
ON public.support_inquiries
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));