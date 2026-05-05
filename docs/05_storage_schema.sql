-- =========================================================================
-- SUPABASE STORAGE: PROJECT DOCUMENTS
-- =========================================================================
-- Run this in your Supabase SQL Editor.
-- STEP 1: Create bucket manually in Supabase Storage UI first, name it:
--   project-docs (private bucket, NOT public)
-- 
-- STEP 2: Run the policies below.

-- RLS Policy: Clients can upload files to their OWN project paths
-- File path must start with: <their_project_id>/
CREATE POLICY "Clients can upload project docs"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'project-docs'
  AND (
    SELECT COUNT(*) FROM public.projects
    WHERE id::text = (string_to_array(name, '/'))[1]
    AND client_id = auth.uid()
  ) > 0
);

-- RLS Policy: Clients can view/download their own project files
CREATE POLICY "Clients can read project docs"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'project-docs'
  AND (
    SELECT COUNT(*) FROM public.projects
    WHERE id::text = (string_to_array(name, '/'))[1]
    AND client_id = auth.uid()
  ) > 0
);

-- RLS Policy: Clients can delete their own project files
CREATE POLICY "Clients can delete project docs"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'project-docs'
  AND (
    SELECT COUNT(*) FROM public.projects
    WHERE id::text = (string_to_array(name, '/'))[1]
    AND client_id = auth.uid()
  ) > 0
);

-- RLS Policy: Admins have full access to all project docs
CREATE POLICY "Admins have full access to project docs"
ON storage.objects
FOR ALL
TO authenticated
USING (
  bucket_id = 'project-docs'
  AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
)
WITH CHECK (
  bucket_id = 'project-docs'
  AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);
