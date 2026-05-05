import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("⚠️ GEMINI_API_KEY IS MISSING! LLM Chat and Vector Embedding functions will drop. Check .env.local");
}

// Instantiate the official Google Gen AI SDK client
export const ai = new GoogleGenAI({ apiKey: apiKey || "" });

/**
 * Helper strictly designed to convert raw project text into highly accurate
 * 768-dimensional float arrays for pgvector mathematical storage.
 */
export async function createTextEmbedding(text: string): Promise<number[]> {
  try {
    const response = await ai.models.embedContent({
      model: "text-embedding-004", // Standard 768 dim vector model
      contents: text,
      config: {
        taskType: "RETRIEVAL_DOCUMENT", // Explicit RAG tuning
      }
    });

    if (!response.embeddings || response.embeddings.length === 0 || !response.embeddings[0].values) {
      throw new Error("Failed to generate embedding vector");
    }

    return response.embeddings[0].values;
  } catch (err) {
    console.error("Vectorization failed:", err);
    throw err;
  }
}
