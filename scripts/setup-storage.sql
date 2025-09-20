-- Create storage bucket for resumes
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'resumes', 
    'resumes', 
    true, 
    5242880, -- 5MB limit
    ARRAY['application/pdf']
);

-- Set up storage policies for resumes bucket
-- Allow authenticated users to upload their own resumes
CREATE POLICY "Users can upload their own resumes" ON storage.objects
FOR INSERT TO authenticated 
WITH CHECK (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to view their own resumes
CREATE POLICY "Users can view their own resumes" ON storage.objects
FOR SELECT TO authenticated 
USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own resumes
CREATE POLICY "Users can delete their own resumes" ON storage.objects
FOR DELETE TO authenticated 
USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow public access to resumes for companies to view them
CREATE POLICY "Public read access for resumes" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'resumes');
