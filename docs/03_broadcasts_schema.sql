-- 03_broadcasts_schema.sql
-- This table manages global announcements and news visible to all users.

CREATE TABLE IF NOT EXISTS broadcasts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'announcement', -- options: 'announcement', 'update', 'alert', 'technical'
  meta_code TEXT, -- technical id for stylistic flair (e.g. BCK-01)
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS (Row Level Security)
ALTER TABLE broadcasts ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone (Public) to READ active broadcasts
CREATE POLICY "Public can read active broadcasts" 
ON broadcasts FOR SELECT 
USING (is_active = true);

-- Policy: Allow only admins (service_role) to mutate
-- (Supabase dashboard access usually bypasses RLS or uses service_role)

-- Seed an initial technical update
INSERT INTO broadcasts (title, content, type, meta_code)
VALUES 
('V3.0 System Hardening Complete', 'Core infrastructure has been upgraded to v3.0 snapshot architecture. Mission validation protocols are now fully active.', 'technical', 'SYS-3.0'),
('New Engineering Hub Active', 'The specialized client cockpit is now live for all active missions. Track your development progress in real-time.', 'announcement', 'UPLINK-01')
ON CONFLICT DO NOTHING;
