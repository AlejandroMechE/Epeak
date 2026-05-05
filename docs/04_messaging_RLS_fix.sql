-- =========================================================================
-- MESSAGING RLS PATCH: ALLOW INSERT & UPDATE
-- =========================================================================
-- Run this in the Supabase SQL Editor to fix the "Chat init error"

-- 1. CONVERSATIONS POLICIES
-- Allow users to create their own conversations (including general support)
CREATE POLICY "Users can insert their own conversations" 
ON public.conversations FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = client_id);

-- Allow users to update the 'last_message_at' timestamp
CREATE POLICY "Users can update their own conversations" 
ON public.conversations FOR UPDATE 
TO authenticated 
USING (auth.uid() = client_id)
WITH CHECK (auth.uid() = client_id);

-- 2. MESSAGES POLICIES
-- Allow users to insert messages into conversations they are part of
CREATE POLICY "Users can insert their own messages" 
ON public.messages FOR INSERT 
TO authenticated 
WITH CHECK (
    auth.uid() = sender_id AND 
    EXISTS (
        SELECT 1 FROM public.conversations 
        WHERE id = conversation_id AND client_id = auth.uid()
    )
);

-- 3. ADMIN OVERRIDE
-- Ensure admin has full access to all support threads
CREATE POLICY "Admins have full access to conversations" 
ON public.conversations FOR ALL 
TO authenticated
USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins have full access to messages" 
ON public.messages FOR ALL 
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.conversations 
        WHERE id = conversation_id AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    )
);
