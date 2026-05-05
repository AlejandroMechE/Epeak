-- ==========================================
-- SUPABASE PGVECTOR INITIALIZATION SCRIPT
-- ==========================================
-- Run this entire script in the 'SQL Editor' section of your Supabase Dashboard

-- 1. Enable the pgvector extension to allow geometric and mathematical vector functions
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Create the central documents table
-- This stores both the raw text for the LLM to read, and the 768-D vector mapping created by Gemini
CREATE TABLE IF NOT EXISTS public.documents (
    id BIGSERIAL PRIMARY KEY,
    url TEXT,
    title TEXT,
    content TEXT,        -- The literal text context (e.g. "Python was used extensively...")
    embedding VECTOR(768) -- Google Gemini text-embedding-004 outputs 768 dimensions
);

-- 3. Create a specialized HNSW Index for ultra-fast semantic similarity retrieval.
-- This ensures the chat bot stays perfectly fast even when you have thousands of projects documented.
CREATE INDEX ON public.documents USING hnsw (embedding vector_cosine_ops);

-- 4. Create the magical "Search" function
-- This is a Postgres Function. When our Next.js backend passes an embedding to the database,
-- this function efficiently searches all vectors in the DB and returns the closest semantic matches.
CREATE OR REPLACE FUNCTION match_documents (
  query_embedding VECTOR(768),
  match_threshold FLOAT,
  match_count INT
)
RETURNS TABLE (
  id BIGINT,
  url TEXT,
  title TEXT,
  content TEXT,
  similarity FLOAT
)
LANGUAGE sql
AS $$
  SELECT
    documents.id,
    documents.url,
    documents.title,
    documents.content,
    1 - (documents.embedding <=> query_embedding) AS similarity
  FROM
    documents
  WHERE
    1 - (documents.embedding <=> query_embedding) > match_threshold
  ORDER BY
    documents.embedding <=> query_embedding
  LIMIT match_count;
$$;
