## Task 1: Bootstrap Decisions (2026-03-17)

### Tech Stack
- Next.js 15.5.x with App Router
- React 19
- TypeScript 5.8
- Tailwind CSS 3.4
- Vitest 3.x for unit tests
- Playwright 1.51 for e2e

### Project Structure
- Single app in repo root (no monorepo)
- `app/` directory for routes and layouts
- `tests/` directory for Vitest unit tests
- `e2e/` directory for Playwright e2e tests
- `src/` directory reserved for future domain code

### Mobile-First Design
- Viewport baseline: 390x844
- Tailwind screens: xs (375px), sm (390px), md (768px), lg (1024px)
- Dark theme with cosmic styling (#0a0a1a background)

### No External Dependencies
- No database, auth provider, or payment services
- All demo data will be local/seeded
- No secrets required for running the app