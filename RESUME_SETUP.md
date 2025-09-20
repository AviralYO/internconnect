# Resume Upload Setup Instructions

The resume upload functionality has been updated to use Supabase Storage instead of Vercel Blob. Here's what you need to do:

## 1. Create the Storage Bucket

Go to your Supabase dashboard (https://ydpksbpfkunysaqiakxk.supabase.co) and:

1. Navigate to **Storage** in the sidebar
2. Click **Create a new bucket**
3. Set bucket name: `resumes`
4. Make it **Public** (checked)
5. Set file size limit: `5242880` (5MB)
6. Set allowed MIME types: `application/pdf`

## 2. Set up Storage Policies (Optional - for extra security)

In the SQL Editor of your Supabase dashboard, run the script from `scripts/setup-storage.sql` to set up proper row-level security policies.

## 3. Test the Upload

Try uploading a PDF resume now. The system will:
- Validate that it's a PDF file
- Check file size (max 5MB)
- Store it in Supabase Storage
- Save the record in the database

## What Changed

- **Before**: Used Vercel Blob storage (required BLOB_READ_WRITE_TOKEN environment variable)
- **After**: Uses Supabase Storage (works with your existing Supabase setup)

The upload route now:
1. Converts the file to a buffer
2. Uploads to Supabase Storage bucket 'resumes'
3. Gets the public URL
4. Saves the record to the database

All authentication and validation remains the same.
