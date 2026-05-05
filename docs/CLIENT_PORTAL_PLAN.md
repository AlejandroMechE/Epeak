# Client Portal & Sales Engine: Technical Blueprint

## 1. The Sales Funnel (Package Builder)
- **UI Architecture**: Multi-step Wizard (React Hook Form).
- **Pricing Logic**: Real-time "Starting at $X" calculation based on selected modules (e.g., IoT, AI-RAG, Auth).
- **Conversion**: On final step, user creates an account. This creates a `project` in the DB with status "Discovery" and the selected "Package Details" as the initial description.

## 2. The Client Portal (Dashboard)
- **Top Row**: Project Title, Current Phase (Progress Bar), Days until next milestone.
- **Milestone Stepper (Horizontal/Vertical)**:
  1. Discovery
  2. Architecture
  3. Local Development
  4. Integration
  5. Beta Testing
  6. Final Release
- **Resources Widget**: Link to the **Contract PDF** stored in Supabase Storage.
- **Meeting Widget**: A static "Next Scheduled Meeting" card with a "Reschedule" redirect to Calendly.

## Proposed Architecture: Phase 5 (Logic & UI) - SECURE FLOW
The following flow is strictly defined to ensure user identity verification:

1. **The Verified Sequence**: 
   - Visitor completes `PackageWizard`.
   - Data is passed to the `signUp` Server Action as **User Metadata**.
   - User is redirected to a `/verify-email` landing page (Glassmorphism).
   - Upon clicking the email link, user is redirected back to `/portal`.
   - **First-Time Check**: A Server Action (`completeOnboarding`) detects the verified session, extracts the metadata, and creates the formal `project` record in the DB.

## Proposed Implementation Steps

### Phase 5.1: The Services Layer (Verified Logic)
*   **Auth Actions**: Implement `signUp` with Metadata support and a `completeOnboarding` check.
*   **Email Templates**: (Alejandro will need to configure these in the Supabase Dashboard later).

### Phase 5.2: Auth & Sales UI
*   Implement `Login`/`Register` and the new `/verify-email` status page.
*   Connect the `PackageWizard` to the signup metadata pipeline.

## 3. Communication System (Tickets)
- **Lifecycle Logic**:
  - **Implementation Phase**: Full messaging access allowed.
  - **Post-Release Phase**: Messaging closes. A specific "Bug Report" ticket form opens (free).
  - **Expansion Phase**: A "New Feature Request" form opens ($$$ Add-on tags clearly displayed).
- **Attachments**: Support for image and PDF uploads via Supabase Buckets.

## 4. AI Feature Sandbox (RAG Demo)
- **Purpose**: A "Live Demo" area where clients can upload their own text or use provided data to see Alejandro's RAG system in action.
- **Tech**: Gemini API + `pgvector` on Supabase.

## 5. Admin Dashboard (Alejandro's View)
- A master table to:
  - Update any project's Milestone (1 to 6).
  - View and Respond to all Ticket threads.
  - Upload/Replace Client Contracts.

## 6. Database Requirements (For DB Bot)
- **Tables**: `profiles`, `projects`, `milestones`, `tickets`, `ticket_responses`.
- **Storage**: Buckets `contracts`, `message_attachments`.
- **Security**: Strict RLS ensuring Profile ID matches Project/Ticket ClientID.
