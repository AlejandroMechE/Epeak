import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createTextEmbedding } from "@/lib/gemini";

// In a real production app, you would lock this endpoint down heavily using NextAuth or a static auth token.
// For now, we will require a secret bearer token passed via headers just to keep people from hitting your endpoint publicly.

const ADMIN_SECRET = process.env.ADMIN_SECRET || "temp-secret"; 

export async function POST(req: NextRequest) {
  try {
    // 1. Basic Authorization Check
    const authHeader = req.headers.get("Authorization");
    if (authHeader !== `Bearer ${ADMIN_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { url, title, text_content } = await req.json();

    if (!text_content) {
      return NextResponse.json({ error: "Missing text payload to vectorize" }, { status: 400 });
    }

    // 2. Generate the Mathematical Vector Map using Gemini GenAI
    // This connects to Google's specialized RAG LLM to deeply understand the text semantics
    // and map them into a 768-dimension floating point array.
    const vectorEmbedding = await createTextEmbedding(text_content);

    // 3. Inject the payload and the Vector Map into Supabase
    // pgvector will automatically handle storing this float array and indexing it via HNSW
    const supabase = await createClient();
    const { error: insertError } = await supabase
      .from("documents")
      .insert({
        url: url || "/custom",
        title: title || "Manual Context Entry",
        content: text_content,
        embedding: vectorEmbedding, // Native pgvector column casting
      });

    if (insertError) {
      throw insertError;
    }

    return NextResponse.json({ 
      success: true, 
      message: "Successfully embedded context and stored via pgvector" 
    });

  } catch (error: any) {
    console.error("Embedding API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
