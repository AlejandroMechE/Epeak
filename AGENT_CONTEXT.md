# Project Context: Bilingual AI-Powered Portfolio & Client Portal

## Objective
To build a highly impressive portfolio and client management SaaS. It must attract recruiters (via AI RAG) and serve active clients (via a secure Portal). The operating cost remains strictly at $0.

## Core Features & Tech Stack
1.  **Frontend Framework**: Next.js (App Router). Server-Side Rendering (SSR) and Static Site Generation (SSG) for superior SEO and performance.
2.  **Internationalization (i18n)**: Native dual-language support (English and Spanish) via `/en` and `/es` routing.
3.  **Authentication**: Supabase SSR (Cookie-based). **Strict RLS mandatory.**
4.  **Database & Vector Storage**: Supabase (PostgreSQL with `pgvector`).
5.  **Advanced AI**: Google Gemini API for the "Chat with my Resume" RAG system.
6.  **Real-Time Portal**: Project tracking via Milestones and a formal Ticket/Messaging system.

## 🏗️ Architect’s Governance (Antigravity Rules)
Any Coding Agent entering this project must follow these mandates:
1.  **Security First**: Row Level Security (RLS) is not an option; it is a requirement. Clients must only access their own `project_id`.
2.  **BFF Pattern**: Use Next.js Server Actions for all database writes. No direct Supabase writes from the client-side.
3.  **i18n Purity**: No hardcoded strings. Portal text must exist in `src/i18n/locales`.
4.  **Styling**: Strict Vanilla CSS. Follow the "Apple Minimalist & Fiery Warm Accent" (Cheng Style) baseline.
5.  **Honesty**: Identify and report technical debt immediately. Do not use "hacks" for layout.

## Master Design Concept
- **Baseline**: Current "Apple Minimalist / Fiery Filament" UI.
- **Portal UI**: High-fidelity glassmorphism dashboard.
- **Transparency**: The "Package Builder" must display real-time pricing estimates to maintain professional transparency and filter leads.
- **The Sandbox**: A dedicated "AI Sandbox" page exists to demo Alejandro's RAG engineering capabilities to potential clients.

## 🔗 Client Experience Architecture
- **Signup**: Public enrollment allowed. New users see a "Welcome/Pending" state until a project is assigned. 
- **Demo Mode**: If a user is not assigned a project, the agent should propose a "Demo Project" view.
- **Milestones**: A visual Stepper showing: *Planning -> Design -> Development -> QA -> Deployment*.
- **Tickets**: Formal threads for project requests.

## 📊 Database Schema (Phase 4 Foundation)
- **Profiles**: `id (UUID)`, `full_name`, `avatar_url`, `role (user_role)`, `language_preference`.
- **Projects**: `id`, `client_id (FK)`, `title`, `description`, `status (project_status)`, `is_active (BOOLEAN)`, `payload (JSONB v3.0)`.
- **Milestones**: `id`, `project_id`, `title`, `status (milestone_status)`, `order`.
- **Tickets/Responses**: Full support threading system with attachments.
- **Enums**:
  - `user_role`: `client`, `admin`.
  - `project_status`: `Discovery` to `Deployed` (6 steps).

## 🛡️ Security Gatekeeper Implementation
1. **Middleware (`src/middleware.ts`)**: Orchestrates locale-aware deep linking. Unauthenticated requests to `/portal` or `/admin` are captured via `?next=` and redirected to `/login`.
2. **Server Actions (`src/features/auth/actions.ts`)**: centralized sign-in/up/out logic utilizing `@supabase/ssr`.
3. **Admin Guard (`src/app/[lang]/admin/layout.tsx`)**: Server-side role verification. Unauthorized access is silently redirected to the portal.
4. **Architect's Rule**: Never query data using client-provided IDs. Always derive the user ID from the server-verified session: `(await supabase.auth.getUser()).data.user.id`.

## 🎨 Specialized Frontend Bot Handover
> **Prompt for Frontend Bot**:
> "You are a Senior Frontend Engineer tasked with building the high-fidelity UI for the Client Portal and Admin Dashboard. 
> 1. **Tech**: Next.js App Router, Vanilla CSS, Supabase SSR.
> 2. **Design**: Modern 'Apple Minimalist / Fiery Warm' aesthetic. Use glassmorphism for dashboard cards.
> 3. **Data**: Use Server Components to fetch data from Supabase. Adhere to the BFF pattern; for writes, invoke the Server Actions in `src/features/auth/actions.ts` or create new ones in that directory.
> 4. **Components**:
>    - **Portal**: Build a 'Project Reality' view including a 6-step Milestone Stepper (`Discovery` -> `Final Release`), progress indicators, and a resources widget.
>    - **Admin**: Build a master control table to update project milestones and respond to tickets.
> 5. **i18n**: All UI text must be fetched from `src/i18n/locales/[lang].json` using the `getDictionary` pattern."

## 🚀 Phase 5: Alpha Mission Initialization (The Cockpit Refinement)
We are transforming the entry-point into a high-fidelity "Engineering Briefing" that mirrors Fiverr Pro standards for solo developers.

### 1. The 4-Stage Workflow:
1.  **Strategy Selection**: Tiered plan selection (Spark -> Engine -> Reactor) + Mission Enhancers (Add-ons).
2.  **Strategic Intelligence**: High-detail business briefing (Problem, Goals, Specs).
3.  **Technical Blueprint**: Architecture selection (Stack, Niche, Integrations).
4.  **Logistics & Fulfillment**: Asset uploads and timeline synchronization.

### 2. Solo Developer High-Value Niches:
- **AI Integration Specialist**: Glue-code for LLMs and automated intelligent workflows.
- **Full-Stack SaaS MVP Builder**: Rapid delivery of production-ready web engines.
- **B2B Workflow Automation**: Systems focused on measurable ROI and labor reduction.
- **Performance E-commerce**: High-conversion optimization for revenue-driven digital stores.

### 3. Mission Tiers (Solo Pricing Benchmarks):
- **Spark (Prototype)**: $1,200 - Rapid PoC and high-conversion landing.
- **Engine (Standard)**: $3,500 - Full-stack business engine with CMS/API integrations.
- **Reactor (Scale)**: $10,000+ - High-availability SaaS with full security and AI modules.

*Note: This file is the source of truth managed by the Expert Architect (Antigravity).*
