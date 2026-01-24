-- Add onboarding_completed column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN onboarding_completed boolean NOT NULL DEFAULT false;

-- Add onboarding_completed_at column
ALTER TABLE public.profiles 
ADD COLUMN onboarding_completed_at timestamp with time zone DEFAULT NULL;