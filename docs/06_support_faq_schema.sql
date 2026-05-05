-- =========================================================================
-- SUPPORT HUB & FAQ SCHEMA
-- =========================================================================
-- This schema establishes the FAQ system.
-- General support chat uses the existing conversations/messages tables
-- by allowing project_id to be NULL.

-- 1. FAQ TABLE
CREATE TABLE IF NOT EXISTS public.faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(50) NOT NULL, -- e.g. 'Getting Started', 'Technical', 'Billing'
    question_en TEXT NOT NULL,
    question_es TEXT NOT NULL,
    answer_en TEXT NOT NULL,
    answer_es TEXT NOT NULL,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- Everyone (Authenticated) can read FAQs
CREATE POLICY "Anyone can read FAQs" 
ON public.faqs FOR SELECT 
TO authenticated 
USING (true);

-- Only Admins can modify FAQs
CREATE POLICY "Admins can manage FAQs" 
ON public.faqs FOR ALL 
TO authenticated 
USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin')
WITH CHECK ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- 2. SEED DATA (Bilingual Engineering FAQs)
INSERT INTO public.faqs (category, question_en, question_es, answer_en, answer_es, order_index)
VALUES 
('Getting Started', 'How do I initialize my first project?', '¿Cómo inicializo mi primer proyecto?', 
 'Navigate to the Start Project section in the sidebar. You can configure your stack, define your objectives, and get a technical estimate immediately.', 
 'Navega a la sección Iniciar Proyecto en la barra lateral. Podrás configurar tu stack, definir objetivos y obtener una estimación técnica de inmediato.', 
 1),
('Technical', 'What technologies do you use for AI agents?', '¿Qué tecnologías usas para los agentes de IA?', 
 'I specialize in RAG architectures using OpenAI/Claude, LangChain, and vector databases like Supabase Vector or Pinecone for long-term memory.', 
 'Me especializo en arquitecturas RAG usando OpenAI/Claude, LangChain y bases de datos vectoriales como Supabase Vector o Pinecone para memoria de largo plazo.', 
 2),
('Security', 'Is my project data secure?', '¿Están seguros los datos de mi proyecto?', 
 'Yes. All project data is stored in isolated Supabase instances with Row Level Security (RLS) and encrypted document storage.', 
 'Sí. Todos los datos del proyecto se almacenan en instancias aisladas de Supabase con seguridad a nivel de fila (RLS) y almacenamiento de documentos encriptado.', 
 3);
