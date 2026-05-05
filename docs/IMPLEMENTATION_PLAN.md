# Premium AI-Powered Portfolio (with RAG Architecture)

This document outlines the plan to build a state-of-the-art portfolio website designed specifically to impress software engineering companies and technical recruiters, while keeping hosting and operational costs strictly at $0.

## Impressive Architecture & Tech Stack

To stand out, we will use a modern, highly sought-after technology stack.

1.  **Frontend & Framework**: **Next.js** (React). This demonstrates your ability to build production-ready, performant web applications with Server-Side Rendering (SSR) and Static Site Generation (SSG).
2.  **Internationalization (i18n)**: We will implement seamless **English/Spanish dual-language support**. The site will feature an elegant language selector and routing that supports both locales (e.g., `/en/about` and `/es/about`).
3.  **Advanced AI Integration (RAG System)**: This is the centerpiece. Instead of a simple AI chatbot, we will build a **Retrieval-Augmented Generation (RAG)** system. We will create a private Admin panel where you can upload context (PDFs, text about projects) which will be embedded and stored in a vector database. The Gemini API will retrieve this embedded context to answer recruiter questions perfectly.
4.  **Database & Vector Storage**: **Supabase (PostgreSQL with `pgvector`)**. We will use Supabase's free tier not just for standard relational data (like a Guestbook) but also for storing mathematical vector embeddings for the RAG AI. This shows seniors you understand modern machine learning architectures.
5.  **Styling**: **Vanilla CSS**. We will implement a custom, premium design system featuring a dynamic **Dark / Light Mode Toggle**. 

## What Will Impress Companies?

Just having a website is standard. To be *impressive*, we will include these software engineering best practices:

*   **RAG Architecture Implementation**: Building a dynamic context-injection pipeline using `pgvector` will blow recruiters away. It proves you understand the backend AI infrastructure.
*   **Bilingual Architecture**: Properly structured i18n that doesn't just translate text, but updates ARIA labels and SEO elements appropriately.
*   **System Architecture Diagram**: A section on your site displaying a visual diagram of your RAG pipeline (Frontend -> Serverless API -> Embeddings -> pgvector -> Gemini). 
*   **Clean, Responsive Design**: A UI with dual Dark/Light mode capabilities built entirely from scratch with Vanilla CSS.

## Proposed Implementation Steps

### 1. Foundation, Design System, & i18n (COMPLETED)
*   Initialized Next.js application with FSD (Feature-Sliced Design) directories.
*   Implemented "Apple Minimalist & Fiery Warm Accent" (Cheng Style) global design system.
*   Configured Next.js i18n dictionaries for English and Spanish.

### 2. Frontend UI Implementation (COMPLETED)
*   Build out core components: `PrimaryIntro` (Hero), `ExpertiseStack`, `OperationalFocus`, `CaseStudiesSection`, and `AboutMe`.
*   Integrated high-fidelity animations (Framer Motion) and cinematic scroll effects.
*   Implemented dynamic Theme Toggling (Dark/Light) and Language Selection.

### 3. Database & Database Storage (Supabase) - [IN PROGRESS]
*   Set up a free Supabase project and enable `pgvector`.
*   Create tables for both structured data (e.g., Guestbook/Projects) and vector embeddings (`documents` table for RAG).
*   Create secure Next.js serverless API routes to communicate with the DB securely.

### 4. Advanced AI Integration (RAG System)
*   **Secure Context Uploader (Admin)**: Protected route to convert resume/project data into vector embeddings via Gemini.
*   **RAG Chatbot UI**: Floating, "Omni-Chat" interface integrating the vector search results for bilingual persona responses.

### 5. Polish, SEO & Deployment
*   Optimize accessibility (ARIA) and SEO metadata for Spanish and English.
*   Push to Vercel for CI/CD and production deployment.
