-- =========================================================================
-- USER CONTROL & BANNING SYSTEM
-- =========================================================================

-- 1. Add columns to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS email TEXT;

-- 2. Update RLS to prevent banned users from doing anything
-- (Optional: You might want to handle this in middleware for better UX)

-- 3. Diagnostic: Check current user statuses
SELECT id, email, role, is_banned FROM public.profiles;
