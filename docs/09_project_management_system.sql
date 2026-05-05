-- =========================================================================
-- PROJECT APPROVAL & MANAGEMENT SYSTEM
-- =========================================================================

-- 1. Add approval fields to projects
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'declined')),
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- 2. Ensure all existing projects are 'approved' (Legacy support)
UPDATE public.projects SET approval_status = 'approved' WHERE approval_status IS NULL;

-- 3. Diagnostic: Check project statuses
SELECT id, title, status, approval_status FROM public.projects;
