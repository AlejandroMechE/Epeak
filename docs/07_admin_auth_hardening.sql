-- =========================================================================
-- ADMIN AUTH HARDENING & SESSION SYNC
-- =========================================================================
-- This script fixes the lockout by ensuring the profiles table is accessible
-- and that the core auth metadata matches the admin role.

-- 1. Profiles RLS: Ensure users can always read their own profile row
-- This breaks the circular dependency where you need the admin role to read your own role.
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

-- 2. Metadata Sync: Force-update the admin role for Alejandro's ID
-- This ensures that the NEXT TIME you sign in, the JWT will carry the admin role.
UPDATE auth.users 
SET raw_user_meta_data = 
  coalesce(raw_user_meta_data, '{}'::jsonb) || 
  jsonb_build_object('role', 'admin')
WHERE id = 'b73e1ffd-d821-4407-bed9-45ee71ba14a8';

-- 3. Confirm Profiles Table has Admin Role
-- Just to be double-certain the relational part is synced.
UPDATE public.profiles 
SET role = 'admin' 
WHERE id = 'b73e1ffd-d821-4407-bed9-45ee71ba14a8';
