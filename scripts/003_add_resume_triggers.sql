-- Create function to automatically set first resume as primary
CREATE OR REPLACE FUNCTION public.set_first_resume_as_primary()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if this is the first resume for the student
  IF NOT EXISTS (
    SELECT 1 FROM public.resumes 
    WHERE student_id = NEW.student_id 
    AND id != NEW.id
  ) THEN
    -- Set this resume as primary if it's the first one
    NEW.is_primary = true;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically set first resume as primary
DROP TRIGGER IF EXISTS set_first_resume_primary ON public.resumes;

CREATE TRIGGER set_first_resume_primary
  BEFORE INSERT ON public.resumes
  FOR EACH ROW
  EXECUTE FUNCTION public.set_first_resume_as_primary();

-- Create function to ensure only one primary resume per student
CREATE OR REPLACE FUNCTION public.ensure_single_primary_resume()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If setting a resume as primary, unset all other primary resumes for this student
  IF NEW.is_primary = true THEN
    UPDATE public.resumes 
    SET is_primary = false 
    WHERE student_id = NEW.student_id 
    AND id != NEW.id 
    AND is_primary = true;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to ensure only one primary resume per student
DROP TRIGGER IF EXISTS ensure_single_primary ON public.resumes;

CREATE TRIGGER ensure_single_primary
  BEFORE UPDATE ON public.resumes
  FOR EACH ROW
  EXECUTE FUNCTION public.ensure_single_primary_resume();
