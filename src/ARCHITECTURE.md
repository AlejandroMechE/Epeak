# Portfolio Architecture

## 1. Frontend System (Liam Chen Design)

### Design Tokens (`globals.css`)
- **Background**: `#fffefd` (Standardized Premium Tint).
- **Accents**: `var(--gradient-filament)` (Orange -> Red tri-tone gradient).
- **Typography Scale**: 
  - `Display`: `clamp(2rem, 5vw, 5rem)` (Outfit)
  - `H1`: `2.2rem` (Outfit)
  - `Body`: `1rem` (Inter)

### Component Library (`src/components`)
- **`ui/Button`**: Polymorphic (Links/Buttons) with 'Glowing Filament' logic.
- **`TechStack`**: Shared radiant-aura icon container.
- **`ProjectCard`**: Glassmorphic, lift-on-hover case study cards.

### Typography System (`src/lib/fonts.ts`)
- **Outfit**: Primary display font for high-impact headers.
- **Inter**: Primary sans-serif font for body text and navigation.

## 2. i18n Strategy (Strict Enforcement)
- **Dictionaries**: [EN](src/i18n/dictionaries/en.json) | [ES](src/i18n/dictionaries/es.json).
- **Type Safety**: Enforced via `Dictionary` interface in `src/types/dictionary.ts`.
- **Validation**: Building the project fails if key parity is not 100% across all languages.

## 3. Data & AI Layer (Phase 6)
- **Engine**: Google Gemini AI (`gemini-1.5-flash`).
- **Embeddings**: Gemini `text-embedding-004` (768-D).
- **Database**: Supabase with `pgvector` extension.
- **Context Source**: `USER_BIO.md` (Raw source of truth for the RAG system).
