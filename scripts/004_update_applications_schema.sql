-- Update applications table to use resume_id instead of resume_url
-- This is a migration script to update the existing schema

-- First, add the resume_id column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'applications' AND column_name = 'resume_id'
    ) THEN
        ALTER TABLE public.applications 
        ADD COLUMN resume_id UUID REFERENCES public.resumes(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Optionally, you can remove the resume_url column after migrating data
-- ALTER TABLE public.applications DROP COLUMN IF EXISTS resume_url;
