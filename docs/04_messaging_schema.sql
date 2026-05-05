-- =========================================================================
-- PORTAL MESSAGING & NOTIFICATION SCHEMA
-- =========================================================================
-- This schema establishes the foundation for the Communication Center.
-- Run this in your Supabase SQL Editor.

-- 1. CONVERSATIONS TABLE
-- Groups messages between a client (user) and the admin (Alejandro)
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    admin_id UUID DEFAULT '00000000-0000-0000-0000-000000000000', -- Simplified for single admin
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. MESSAGES TABLE
-- Stores the actual message content
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. NOTIFICATIONS VIEW (Optional snippet for easy fetching)
-- Shows summary for the Communication Center
CREATE OR REPLACE VIEW public.notification_summaries AS
SELECT 
    m.id,
    c.id as conversation_id,
    c.project_id,
    c.client_id,
    m.content as preview,
    m.created_at,
    m.is_read,
    p.title as project_title
FROM public.messages m
JOIN public.conversations c ON m.conversation_id = c.id
JOIN public.projects p ON c.project_id = p.id
ORDER BY m.created_at DESC;

-- Enable RLS (Row Level Security)
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Rules: Users can only see their own conversations/messages
CREATE POLICY "Users can view their own conversations" 
ON public.conversations FOR SELECT 
USING (auth.uid() = client_id);

CREATE POLICY "Users can view their own messages" 
ON public.messages FOR SELECT 
USING (auth.uid() IN (
    SELECT client_id FROM public.conversations WHERE id = conversation_id
));
