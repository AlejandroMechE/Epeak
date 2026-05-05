-- ==========================================
-- PROJECTS & MISSION BRIEFING SCHEMA (IDEMPOTENT)
-- ==========================================

-- 1. Ensure the table exists with modern requirements
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'projects') THEN
        CREATE TABLE public.projects (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            title TEXT NOT NULL,
            description TEXT,
            status TEXT NOT NULL DEFAULT 'Discovery',
            is_active BOOLEAN DEFAULT true,
            total_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
            currency TEXT NOT NULL DEFAULT 'MXN',
            payload JSONB NOT NULL DEFAULT '{}',
            created_at TIMESTAMPTZ DEFAULT now(),
            updated_at TIMESTAMPTZ DEFAULT now()
        );
    ELSE
        -- Ensure columns exist if table was created previously with old schema
        ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS description TEXT;
        ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
        ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS total_price NUMERIC(10, 2) DEFAULT 0;
        ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'MXN';
        ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS payload JSONB DEFAULT '{}';
    END IF;
END $$;

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- 3. Clean up and Re-create RLS Policies
DROP POLICY IF EXISTS "Clients can view their own projects" ON public.projects;
DROP POLICY IF EXISTS "Clients can create their own projects" ON public.projects;
DROP POLICY IF EXISTS "Admins have full access" ON public.projects;

-- Policy: Clients can only see and manage their own projects
CREATE POLICY "Clients can view their own projects" 
    ON public.projects 
    FOR SELECT 
    USING (auth.uid() = client_id);

CREATE POLICY "Clients can create their own projects" 
    ON public.projects 
    FOR INSERT 
    WITH CHECK (auth.uid() = client_id);

-- Policy: Admins have full access
-- Using auth.jwt() to check metadata is the secure way for RLS (querying auth.users directly is restricted)
CREATE POLICY "Admins have full access" 
    ON public.projects 
    FOR ALL 
    TO authenticated
    USING (
      (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    );

-- 4. Automatic Update of updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop and recreate trigger to ensure freshness
DROP TRIGGER IF EXISTS update_projects_updated_at ON public.projects;
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
