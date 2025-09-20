-- Add 'confirmed' status to applications table constraint
-- This migration adds the new status option for when students confirm internship offers

-- First, drop the existing check constraint
ALTER TABLE public.applications DROP CONSTRAINT IF EXISTS applications_status_check;

-- Add the new constraint with 'confirmed' status
ALTER TABLE public.applications 
ADD CONSTRAINT applications_status_check 
CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected', 'confirmed'));
