# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

- `npm run dev` — start the dev server (Turbopack, default port 3000; falls back to 3001+ if occupied)
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — ESLint (flat config in `eslint.config.mjs`, extends `eslint-config-next` core-web-vitals + typescript)
- `npx tsc --noEmit` — typecheck (no dedicated script; run directly)
- No test framework is configured in this repo — there are no test files or test scripts.

## Architecture

**This is a Next.js 16 project — APIs/conventions differ from older Next.js training data.** See `@AGENTS.md` above and check `node_modules/next/dist/docs/` before writing Next-specific code (routing, middleware, caching, etc.). Notably, `middleware.ts` is renamed to `proxy.ts` in this version — it does not exist yet in this repo.

### Routing & structure
- App Router, routes live directly under `app/` — there is **no `src/` directory**.
- Import alias `@/*` resolves to the repo root (see `tsconfig.json` `paths`), e.g. `@/lib/supabase/server`, `@/components/BottomTabNav`.
- Directory-name convention matters: a folder prefixed with `_` (e.g. `app/_foo`) is a Next.js *private folder* and is excluded from routing — don't use that prefix for real route segments.

### Mobile-web shell
The app is designed mobile-first and rendered as a fixed-width column even on desktop. `app/layout.tsx` wraps every page in:
- an outer `bg-gray-100` full-viewport background, horizontally centered
- an inner `max-w-md` white container (`relative`, `min-h-screen`, `flex flex-col`) that holds all page content
- `components/BottomTabNav.tsx` (client component) fixed to the viewport bottom but width-matched to the same `max-w-md` column via `mx-auto`, so it visually stays inside the mobile container instead of spanning the full browser width
- the scrollable content area has `pb-[82px]` to clear the fixed tab bar's height

`BottomTabNav` has 3 tabs — 홈 (`/`), 내 정보 (`/my`), 설정 (`/settings`) — with active state derived from `usePathname()`. The brand accent color (`#FF6B57`) is currently hardcoded as an arbitrary Tailwind value in that component; no Tailwind theme token for it exists yet.

### Styling (Tailwind v4)
Tailwind v4 is configured CSS-first in `app/globals.css` via `@theme inline` — there is no `tailwind.config.ts/js`, and none should be added. **Cascade-layer gotcha**: any custom CSS written outside of Tailwind's own layers (e.g. a plain `body { background: ... }` rule) takes priority over Tailwind utility classes regardless of source order, because Tailwind wraps its utilities in a CSS cascade layer and unlayered rules always win. This previously caused `bg-gray-100` on `<body>` to be silently overridden by leftover `create-next-app` boilerplate CSS — if a Tailwind utility class appears to have no effect, check `globals.css` for an unlayered rule targeting the same element first.

### Supabase integration
- `@supabase/ssr` is used with two separate client factories, matching the App Router SSR pattern:
  - `lib/supabase/client.ts` — `createBrowserClient(...)`, for Client Components
  - `lib/supabase/server.ts` — async `createClient()` wrapping `createServerClient(...)`, reads/writes cookies via `next/headers` `cookies()`; the `setAll` cookie write is wrapped in `try/catch` since Server Components can't set cookies (that requires a Server Action or `proxy.ts`)
- Env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (`.env.local`, gitignored; placeholders live in `.env.example`)
- Not built yet: `proxy.ts` (session refresh + optimistic route-guard redirects for protected pages), DB migrations / RLS policies (no `supabase/` directory exists yet), Storage bucket setup. These are planned but intentionally deferred — see `docs/supabase-setup.md`.

### `docs/` — planning documents that drive implementation
These are the source of truth for *what* to build; consult them before adding features rather than inferring requirements from code alone:
- `docs/requirements.md` — functional requirements, screen list (S-01–S-10 with routes/auth requirements), user flows, DB schema (profiles/posts/comments/likes), RLS/storage intent
- `docs/design.md` — Figma design analysis: screen-to-component mapping, color palette (brand orange `#FF6B57` + gray/red scales), typography (IBM Plex Sans / Poppins), spacing/radius tokens
- `docs/plan.md` — overall build plan: target folder structure, route table, DB table overview, implementation order, and cautions (RLS as final defense, `getUser()` vs `getSession()`, etc.)
- `docs/supabase-setup.md` — the specific, narrower plan for the current Supabase connection step and what's explicitly deferred to later steps
