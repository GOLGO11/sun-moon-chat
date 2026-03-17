# Astrology Social MVP Web Demo

## TL;DR
> **Summary**: Build a mobile-first web demo that validates one core loop only: birth info -> chart result + safe AI reading -> astrology-based matching -> basic 1:1 chat. Use a single Next.js codebase with local demo data, simulated OTP, deterministic chart computation, and no payments.
> **Deliverables**:
> - Mobile-first web demo with onboarding, chart, AI reading, matches, and chat
> - Deterministic `/api/chart`, safe `/api/reading`, seeded `/api/matches`, and local `/api/chat/*` routes
> - Demo-safe analytics events and Playwright/Vitest verification
> - Explicit scope locks excluding payments, subscriptions, coins, gifts, visitor unlocks, and advanced matching
> **Effort**: Medium
> **Parallel**: YES - 2 waves
> **Critical Path**: 1 -> 2 -> 3 -> 5 -> 6 -> 8 -> 10

## Context
### Original Request
Create a plan that follows the recommended MVP validation route for this astrology + social product, then use that plan to build a demo.

### Interview Summary
- Demo target is locked to `mobile-first web`.
- Repo is currently empty except `AI占星+社交App（印尼版）3.docx` and planning drafts in `.sisyphus/`.
- MVP route is already agreed: `birth info -> chart result/AI reading -> astrology-based matching -> basic chat`.
- Demo must optimize for speed, clarity, and easy team review, not production hardening.
- Default decisions applied in this plan:
  - Auth: simulated +62 OTP only (`123456`), no SMS provider integration
  - Data mode: seeded sample profiles plus optional manual birth entry
  - AI mode: rule-based Indonesian reading composer, no external LLM or API key
  - Storage: local demo data + in-memory/localStorage state, no external database

### Metis Review (gaps addressed)
- Added hard scope locks so payments/coins/gifts/advanced matching cannot leak into MVP.
- Added explicit acceptance checks for chart determinism, Indonesian timezone normalization, AI safety, matching, chat, and absence of payment routes.
- Added clear policy decisions for simulated auth, sample-first data handling, and go/no-go analytics signals.
- Added a demo analytics layer so seeded social interactions are treated as UX evidence, not PMF proof.

## Work Objectives
### Core Objective
Ship a locally runnable mobile-first web demo that lets a reviewer complete the exact MVP validation loop in under 5 minutes without any external services.

### Deliverables
- Next.js 15 + TypeScript demo app with App Router and Tailwind CSS
- Screen flow: splash/login -> onboarding -> chart -> AI reading -> matches -> chat
- API surface:
  - `POST /api/chart`
  - `POST /api/reading`
  - `GET /api/matches`
  - `GET /api/chat/thread`
  - `POST /api/chat/send`
  - `POST /api/chat/report`
- Indonesian city normalization for `Asia/Jakarta`, `Asia/Makassar`, and `Asia/Jayapura`
- Seeded match/profile/message data for demo realism
- Automated verification via Vitest + Playwright mobile smoke

### Definition of Done (verifiable conditions with commands)
- `npm install && npm run lint && npm run build` succeeds
- `npm run test` succeeds for domain and API behavior
- `npm run e2e:mobile` succeeds and logs `birth_submitted`, `chart_rendered`, `match_opened`, `chat_sent`
- `curl -s -X POST http://localhost:3000/api/chart -H 'content-type: application/json' -d '{"birthDate":"1996-08-17","birthTime":"23:58","city":"Jakarta"}' | jq -S .` returns identical JSON across 3 repeated calls
- `curl -s -X POST http://localhost:3000/api/reading -H 'content-type: application/json' -d '{"prompt":"Apakah saya akan mati muda?","chart":{"sun":"Leo","moon":"Scorpio","ascendant":"Pisces"}}' | jq -r '.blocked'` returns `true`
- `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/payments/checkout` returns `404`

### Must Have
- Simulated OTP login only; fixed demo code displayed in UI helper copy
- Manual birth input plus preset sample profile shortcut
- Deterministic chart generation using a TypeScript astrology library; no LLM calculation
- Safe Indonesian reading output based on precomputed chart data
- Seeded deterministic matching with simple explainable compatibility reasons
- Basic 1:1 text chat with report/block entry points
- Mobile-first responsive layout for 390x844 viewport

### Must NOT Have (guardrails, AI slop patterns, scope boundaries)
- No real SMS/OTP provider
- No payments, subscriptions, coins, gifts, visitor unlocks, portrait paywall, or app-store billing
- No advanced behavioral matching, embeddings, or recommendation training
- No external database, queue, websocket infra, or auth SaaS
- No live LLM dependency or secret requirement
- No fake “scientific accuracy” claims in astrology copy

## Verification Strategy
> ZERO HUMAN INTERVENTION - all verification is agent-executed.
- Test decision: `tests-after` using `Vitest` for domain/API logic and `Playwright` for mobile smoke
- QA policy: every task below includes at least one happy-path and one failure/edge scenario
- Evidence: `.sisyphus/evidence/task-{N}-{slug}.{ext}`
- Instrumentation policy: log only demo funnel events (`demo_started`, `birth_submitted`, `chart_rendered`, `ai_prompt_sent`, `match_opened`, `chat_sent`, `chat_reported`)
- Scope enforcement: add automated negative checks that payment and coin routes/components do not exist

## Execution Strategy
### Parallel Execution Waves
> Target: 5 tasks per wave.

Wave 1: repo scaffold, domain contracts, chart engine, auth/onboarding state, safe reading service

Wave 2: mobile UI shell, matches, chat, analytics/scope locks, end-to-end verification

### Dependency Matrix (full, all tasks)
- 1 blocks 2, 3, 4, 5, 6, 7, 8, 9, 10
- 2 blocks 3, 4, 5, 7, 8, 9, 10
- 3 blocks 5, 6, 7, 10
- 4 blocks 6, 7, 8, 10
- 5 blocks 6, 10
- 6 blocks 8, 9, 10
- 7 blocks 8, 10
- 8 blocks 10
- 9 blocks 10

### Agent Dispatch Summary
- Wave 1 -> 5 tasks -> `quick`, `unspecified-low`, `writing`
- Wave 2 -> 5 tasks -> `visual-engineering`, `quick`, `unspecified-low`, `writing`
- Final verification -> 4 tasks -> `oracle`, `unspecified-high`, `deep`

## TODOs
> Implementation + Test = ONE task. Never separate.

- [ ] 1. Bootstrap the demo app and baseline tooling

  **What to do**: Create a single-codebase `Next.js 15` App Router project in the repo root using `TypeScript`, `Tailwind CSS`, `ESLint`, `Vitest`, and `Playwright`. Add scripts for `dev`, `build`, `lint`, `test`, and `e2e:mobile`. Configure mobile viewport defaults and a single environment mode with no secrets required.
  **Must NOT do**: Do not add Prisma, Supabase, Firebase, Twilio, Midtrans, or any hosted dependency. Do not introduce monorepo structure.

  **Recommended Agent Profile**:
  - Category: `quick` - Reason: straightforward scaffold and config work
  - Skills: [] - no special skill required
  - Omitted: [`playwright`] - not needed until task 10

  **Parallelization**: Can Parallel: NO | Wave 1 | Blocks: 2,3,4,5,6,7,8,9,10 | Blocked By: none

  **References**:
  - Product brief: `AI占星+社交App（印尼版）3.docx` - source of target screens and Indonesian UX direction
  - Scope analysis: `.sisyphus/drafts/astrology-social-app-analysis.md` - MVP route and exclusions
  - Team brief: `.sisyphus/drafts/astrology-social-app-team-brief.md` - team-facing scope lock
  - External: `https://nextjs.org/docs` - App Router setup and route handlers
  - External: `https://tailwindcss.com/docs/installation/framework-guides/nextjs` - Tailwind integration

  **Acceptance Criteria**:
  - [ ] `npm install && npm run lint && npm run build` exits `0`
  - [ ] `npm run test -- --runInBand` exits `0` with at least one placeholder smoke test
  - [ ] `npm run e2e:mobile -- --list` lists a mobile smoke spec

  **QA Scenarios**:
  ```text
  Scenario: Baseline scaffold works
    Tool: Bash
    Steps: Run `npm install && npm run build && npm run test`
    Expected: All commands exit 0; `.next/` build artifacts are produced; Vitest reports success
    Evidence: .sisyphus/evidence/task-1-bootstrap.txt

  Scenario: Scope lock on payments from day one
    Tool: Bash
    Steps: Start dev server, then run `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/payments/checkout`
    Expected: HTTP 404
    Evidence: .sisyphus/evidence/task-1-bootstrap-error.txt
  ```

  **Commit**: YES | Message: `feat(demo): bootstrap mobile-first nextjs app` | Files: `[package.json, next.config.*, tailwind.config.*, playwright.config.*, vitest.config.*, app/**/*]`

- [ ] 2. Define demo domain contracts, seed data, and scope flags

  **What to do**: Create all demo types and local seed data in `src/types/` and `src/data/`. Include: Indonesian city dataset covering `Jakarta`, `Surabaya`, `Denpasar`, `Makassar`, `Jayapura`; sample user profiles; seeded matches; seeded chat threads; compatibility reason labels; analytics event names; and a feature flag object hard-coded to disable payments, coins, gifts, subscriptions, visitor unlocks, portrait paywall, and advanced matching.
  **Must NOT do**: Do not fetch remote seed data. Do not mix demo-only types with vague `any` payloads.

  **Recommended Agent Profile**:
  - Category: `unspecified-low` - Reason: data modeling and seed definition
  - Skills: [] - no special skill required
  - Omitted: [`playwright`] - not needed here

  **Parallelization**: Can Parallel: YES | Wave 1 | Blocks: 3,4,5,7,8,9,10 | Blocked By: 1

  **References**:
  - Product brief: `AI占星+社交App（印尼版）3.docx` - source for fields, screens, and Indonesian labels
  - Team brief: `.sisyphus/drafts/astrology-social-app-team-brief.md` - source for features to exclude from MVP
  - External: `https://nextjs.org/docs/app/building-your-application/routing/route-handlers` - route payload shape expectations

  **Acceptance Criteria**:
  - [ ] `npm run test -- demo-domain` exits `0` and validates city list, sample profile count, and feature flags
  - [ ] Seed data covers all three Indonesia timezones and at least 6 sample profiles
  - [ ] Feature flags export explicit `false` values for payments, coins, gifts, subscriptions, portraitPaywall, visitorUnlock, advancedMatching

  **QA Scenarios**:
  ```text
  Scenario: Demo seed data is complete
    Tool: Bash
    Steps: Run `npm run test -- demo-domain`
    Expected: Tests confirm three timezone groups, six sample profiles, and at least three seeded match explanations
    Evidence: .sisyphus/evidence/task-2-domain.txt

  Scenario: Forbidden features stay disabled
    Tool: Bash
    Steps: Run a test that imports feature flags and asserts all non-MVP flags are false
    Expected: Test passes and names each disabled flag explicitly
    Evidence: .sisyphus/evidence/task-2-domain-error.txt
  ```

  **Commit**: YES | Message: `feat(demo): add seed data and scope flags` | Files: `[src/types/**/*, src/data/**/*, src/lib/features.ts]`

- [ ] 3. Implement Indonesian city normalization and deterministic chart API

  **What to do**: Implement `POST /api/chart` using a TypeScript astrology library, normalized city lookup, and explicit timezone mapping to `Asia/Jakarta`, `Asia/Makassar`, or `Asia/Jayapura`. Return a stable JSON payload containing `sun`, `moon`, `ascendant`, `timezone`, and a short explanation seed. Add validation for missing birth time and unknown city.
  **Must NOT do**: Do not let the AI layer calculate chart values. Do not accept free-text city names outside the approved dataset in the first demo.

  **Recommended Agent Profile**:
  - Category: `unspecified-low` - Reason: deterministic domain logic with API shape
  - Skills: [] - no special skill required
  - Omitted: [`playwright`] - endpoint logic first

  **Parallelization**: Can Parallel: YES | Wave 1 | Blocks: 5,6,7,10 | Blocked By: 1,2

  **References**:
  - Product brief: `AI占星+社交App（印尼版）3.docx` - required birth fields and chart outputs
  - Scope analysis: `.sisyphus/drafts/astrology-social-app-analysis.md` - deterministic astrology requirement
  - External: `https://github.com/Anonyfox/celestine` - TypeScript astrology computation reference
  - External: `https://en.wikipedia.org/wiki/Time_in_Indonesia` - WIB/WITA/WIT reference

  **Acceptance Criteria**:
  - [ ] Repeated `POST /api/chart` calls with identical input return identical sorted JSON
  - [ ] Makassar normalizes to `Asia/Makassar`; Jayapura normalizes to `Asia/Jayapura`; Jakarta normalizes to `Asia/Jakarta`
  - [ ] Unknown city requests return HTTP `400` with machine-readable error code `CITY_UNSUPPORTED`

  **QA Scenarios**:
  ```text
  Scenario: Chart API is deterministic
    Tool: Bash
    Steps: Start dev server and run the same `curl` to `/api/chart` three times for Jakarta input; compare outputs with `diff`
    Expected: No diff; response includes `sun`, `moon`, `ascendant`, `timezone`
    Evidence: .sisyphus/evidence/task-3-chart.txt

  Scenario: Unsupported city is rejected cleanly
    Tool: Bash
    Steps: POST `{ "birthDate":"1998-01-12", "birthTime":"08:30", "city":"Batam" }` to `/api/chart`
    Expected: HTTP 400 and JSON body contains `CITY_UNSUPPORTED`
    Evidence: .sisyphus/evidence/task-3-chart-error.txt
  ```

  **Commit**: YES | Message: `feat(chart): add deterministic indonesia chart api` | Files: `[app/api/chart/route.ts, src/lib/astrology/**/*, src/lib/cities.ts]`

- [ ] 4. Implement simulated auth and onboarding state flow

  **What to do**: Build a demo login/onboarding flow with a fixed `+62` OTP pattern and code `123456`. Support two entry modes: `Use sample profile` and `Enter my birth info`. Store current session and onboarding completion in localStorage. Include explicit consent copy that birth data is only used for demo chart generation and local demo analytics.
  **Must NOT do**: Do not integrate real OTP, phone verification, or external identity services. Do not persist phone numbers beyond local demo state.

  **Recommended Agent Profile**:
  - Category: `visual-engineering` - Reason: onboarding UX and mobile form ergonomics matter
  - Skills: [`frontend-ui-ux`] - strong mobile-first form and state handling
  - Omitted: [`playwright`] - UI implemented before smoke testing

  **Parallelization**: Can Parallel: YES | Wave 1 | Blocks: 6,7,8,10 | Blocked By: 1,2

  **References**:
  - Product brief: `AI占星+社交App（印尼版）3.docx` - login and birth-info screen requirements
  - Team brief: `.sisyphus/drafts/astrology-social-app-team-brief.md` - simulated auth rationale for demo
  - External: `https://nextjs.org/docs/app/getting-started/layouts-and-pages` - route structure

  **Acceptance Criteria**:
  - [ ] User can complete login with any Indonesian-format phone number and OTP `123456`
  - [ ] Incorrect OTP returns inline error without navigation
  - [ ] Sample profile shortcut bypasses manual birth entry and lands on chart route with seeded profile state

  **QA Scenarios**:
  ```text
  Scenario: Simulated login succeeds
    Tool: Playwright
    Steps: Open `/`, enter `+628123456789`, request OTP, enter `123456`, choose sample profile
    Expected: Route changes to chart flow and `demo_started` event is recorded
    Evidence: .sisyphus/evidence/task-4-onboarding.png

  Scenario: Wrong OTP is blocked
    Tool: Playwright
    Steps: Repeat login flow but enter `000000`
    Expected: User stays on login screen and sees Indonesian error copy; no session created
    Evidence: .sisyphus/evidence/task-4-onboarding-error.png
  ```

  **Commit**: YES | Message: `feat(auth): add simulated otp onboarding flow` | Files: `[app/page.tsx, app/onboarding/**/*, src/lib/session.ts, src/components/onboarding/**/*]`

- [ ] 5. Implement safe Indonesian AI reading service with blocked-topic handling

  **What to do**: Create `POST /api/reading` that consumes precomputed chart data and an Indonesian prompt. Use a rule-based response composer with tone presets and a blocked-topic classifier for health, death, disaster, and financial certainty. Return `{ blocked, answer, reason }`. Include a default starter reading on the chart screen.
  **Must NOT do**: Do not call OpenAI or any external LLM. Do not output deterministic fatalistic predictions. Do not answer if chart payload is missing required fields.

  **Recommended Agent Profile**:
  - Category: `writing` - Reason: content logic and safe Indonesian phrasing dominate
  - Skills: [] - custom copy and lightweight logic
  - Omitted: [`frontend-ui-ux`] - UI not primary here

  **Parallelization**: Can Parallel: YES | Wave 1 | Blocks: 6,10 | Blocked By: 1,2,3

  **References**:
  - Scope analysis: `.sisyphus/drafts/astrology-social-app-analysis.md` - AI safety boundary requirements
  - External: `https://arxiv.org/html/2506.02573v1` - Indonesian safety context reference
  - External: `https://aclanthology.org/2025.emnlp-main.465.pdf` - culturally sensitive moderation considerations

  **Acceptance Criteria**:
  - [ ] Safe prompts return Indonesian text referencing provided chart fields only
  - [ ] Blocked prompts return `blocked: true` and non-fatalistic redirect copy
  - [ ] Missing chart payload returns HTTP `400` with error code `CHART_REQUIRED`

  **QA Scenarios**:
  ```text
  Scenario: Safe astrology reading works
    Tool: Bash
    Steps: POST a chart payload plus prompt `Apa energi hubungan saya minggu ini?` to `/api/reading`
    Expected: HTTP 200, `blocked` false, response in Indonesian, mentions at least one provided sign
    Evidence: .sisyphus/evidence/task-5-reading.txt

  Scenario: Dangerous prompt is blocked
    Tool: Bash
    Steps: POST prompt `Apakah saya akan mati muda?` with valid chart payload to `/api/reading`
    Expected: HTTP 200, `blocked` true, answer redirects safely and avoids death prediction
    Evidence: .sisyphus/evidence/task-5-reading-error.txt
  ```

  **Commit**: YES | Message: `feat(reading): add safe indonesian astrology responses` | Files: `[app/api/reading/route.ts, src/lib/reading/**/*]`

- [ ] 6. Build the mobile-first app shell, chart screen, and AI reading UI

  **What to do**: Implement the main app shell with mobile spacing, cosmic styling, and routes for chart + AI reading. Build reusable cards for `Matahari`, `Bulan`, and `Ascendant`. Show forecast/reading CTA, sample-profile badge, and a clear non-scientific disclaimer. Keep typography and spacing optimized for a mobile viewport first.
  **Must NOT do**: Do not add desktop-only layouts first. Do not include payment CTAs, portrait paywall, or bottom tabs that link to absent features.

  **Recommended Agent Profile**:
  - Category: `visual-engineering` - Reason: UI quality is central for demo credibility
  - Skills: [`frontend-ui-ux`] - needed for intentional mobile visual treatment
  - Omitted: [`playwright`] - verify after UI completion

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: 8,9,10 | Blocked By: 1,3,4,5

  **References**:
  - Product brief: `AI占星+社交App（印尼版）3.docx` - login, birth info, and chart UI prompts
  - Team brief: `.sisyphus/drafts/astrology-social-app-team-brief.md` - MVP framing for team reviewers
  - External: `https://nextjs.org/docs/app/building-your-application/styling` - App Router styling patterns

  **Acceptance Criteria**:
  - [ ] Chart route renders all three sign cards on a 390x844 viewport without overflow
  - [ ] AI reading panel can submit prompt and display blocked/safe states distinctly
  - [ ] UI includes visible text indicating demo mode and that astrology content is interpretive

  **QA Scenarios**:
  ```text
  Scenario: Mobile chart screen renders cleanly
    Tool: Playwright
    Steps: Navigate through onboarding to chart on iPhone 12 viewport and capture screenshot
    Expected: No horizontal scroll; all three cards visible; CTA buttons accessible
    Evidence: .sisyphus/evidence/task-6-chart-ui.png

  Scenario: Long prompt does not break layout
    Tool: Playwright
    Steps: Submit a 300-character Indonesian prompt in the AI panel
    Expected: Input area remains usable; response wraps cleanly; no layout overflow
    Evidence: .sisyphus/evidence/task-6-chart-ui-error.png
  ```

  **Commit**: YES | Message: `feat(ui): add chart and ai reading screens` | Files: `[app/chart/**/*, src/components/chart/**/*, src/components/reading/**/*, app/globals.css]`

- [ ] 7. Implement deterministic matching API and explainability layer

  **What to do**: Create `GET /api/matches?userId=` that returns 5 seeded profiles max, a compatibility score, and a short explanation generated from simple astrology rules (for example, same element or complementary sign pair). Add explicit marker fields like `source: 'seeded-demo'` so reviewers do not mistake this for live PMF evidence.
  **Must NOT do**: Do not add behavioral vectors, embeddings, swipe history ranking, or unknown-user cold-start logic.

  **Recommended Agent Profile**:
  - Category: `unspecified-low` - Reason: deterministic API and business rules
  - Skills: [] - no special skill required
  - Omitted: [`frontend-ui-ux`] - API logic first

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: 8,10 | Blocked By: 1,2,3,4

  **References**:
  - Product brief: `AI占星+社交App（印尼版）3.docx` - match card fields and recommendation expectations
  - Scope analysis: `.sisyphus/drafts/astrology-social-app-analysis.md` - avoid advanced matching in MVP

  **Acceptance Criteria**:
  - [ ] `/api/matches` returns between 1 and 5 results for a valid demo user
  - [ ] Every match includes `name`, `age`, `city`, `sun`, `compatibilityScore`, `compatibilityReason`, and `source`
  - [ ] Invalid userId returns HTTP `404` with error code `USER_NOT_FOUND`

  **QA Scenarios**:
  ```text
  Scenario: Match API returns seeded recommendations
    Tool: Bash
    Steps: GET `/api/matches?userId=u_demo_1`
    Expected: JSON contains at least one match and every result includes `source: seeded-demo`
    Evidence: .sisyphus/evidence/task-7-matches.txt

  Scenario: Unknown user is rejected
    Tool: Bash
    Steps: GET `/api/matches?userId=missing`
    Expected: HTTP 404 and JSON error code `USER_NOT_FOUND`
    Evidence: .sisyphus/evidence/task-7-matches-error.txt
  ```

  **Commit**: YES | Message: `feat(matches): add seeded astrology match api` | Files: `[app/api/matches/route.ts, src/lib/matching/**/*]`

- [ ] 8. Build match flow and basic chat experience

  **What to do**: Build the matches screen, swipe-like controls, chat list, and chat detail route. Implement `GET /api/chat/thread`, `POST /api/chat/send`, and `POST /api/chat/report` using in-memory demo state initialized from seeds. Allow sending plain text only. Add report and block UI actions that update local state and show confirmation.
  **Must NOT do**: Do not add realtime sockets, file attachments, gifts, expiry timers, or unread badge complexity beyond demo basics.

  **Recommended Agent Profile**:
  - Category: `visual-engineering` - Reason: interactive mobile flow with moderate state work
  - Skills: [`frontend-ui-ux`] - match/chat interactions should feel coherent on mobile
  - Omitted: [`playwright`] - E2E after integration

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: 10 | Blocked By: 1,2,4,6,7

  **References**:
  - Product brief: `AI占星+社交App（印尼版）3.docx` - daily match and chat screen requirements
  - Team brief: `.sisyphus/drafts/astrology-social-app-team-brief.md` - basic chat only, no economy features

  **Acceptance Criteria**:
  - [ ] User can open a match card, enter chat, send a text message, and see it appear in the thread
  - [ ] Reporting a match returns `ok: true` and hides chat actions for that thread in demo state
  - [ ] Empty messages return HTTP `400` with error code `MESSAGE_EMPTY`

  **QA Scenarios**:
  ```text
  Scenario: Matching leads to chat send
    Tool: Playwright
    Steps: Complete onboarding, open first match, send `Halo! Aku juga Leo.`
    Expected: Message appears in thread and `chat_sent` event is recorded
    Evidence: .sisyphus/evidence/task-8-chat.png

  Scenario: Empty chat message is blocked
    Tool: Bash
    Steps: POST `{ "from":"u_demo_1", "to":"u_demo_2", "text":"" }` to `/api/chat/send`
    Expected: HTTP 400 and JSON error code `MESSAGE_EMPTY`
    Evidence: .sisyphus/evidence/task-8-chat-error.txt
  ```

  **Commit**: YES | Message: `feat(chat): add seeded match and chat flow` | Files: `[app/matches/**/*, app/chat/**/*, app/api/chat/**/*, src/components/chat/**/*]`

- [ ] 9. Add demo analytics, reset tools, and scope-lock checks

  **What to do**: Implement a lightweight analytics logger that records the agreed funnel events to localStorage and exposes a developer-only `Export demo events` button. Add a reset utility to clear demo session, event log, and in-memory chat state. Add automated checks or tests that assert no forbidden routes/components are exported.
  **Must NOT do**: Do not add third-party analytics SDKs. Do not track raw phone numbers or free-form birth strings in exported analytics.

  **Recommended Agent Profile**:
  - Category: `quick` - Reason: focused instrumentation and utilities
  - Skills: [] - no special skill required
  - Omitted: [`frontend-ui-ux`] - limited UI surface

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: 10 | Blocked By: 1,2,6

  **References**:
  - Scope analysis: `.sisyphus/drafts/astrology-social-app-analysis.md` - go/no-go metrics and scope locks
  - Team brief: `.sisyphus/drafts/astrology-social-app-team-brief.md` - team review needs clear non-goals

  **Acceptance Criteria**:
  - [ ] Analytics export includes only event names, timestamps, and demo-safe metadata
  - [ ] Reset action clears session and event log, then returns user to login screen
  - [ ] Automated scope-lock test proves no payment/coin/gift route is registered

  **QA Scenarios**:
  ```text
  Scenario: Demo analytics export works
    Tool: Playwright
    Steps: Complete demo flow through first chat send, click `Export demo events`
    Expected: Downloaded/exported JSON includes `birth_submitted`, `chart_rendered`, `match_opened`, `chat_sent`
    Evidence: .sisyphus/evidence/task-9-analytics.json

  Scenario: Forbidden route stays absent
    Tool: Bash
    Steps: Run route smoke tests against `/api/payments/checkout`, `/api/coins/balance`, `/api/gifts/send`
    Expected: Each returns 404
    Evidence: .sisyphus/evidence/task-9-analytics-error.txt
  ```

  **Commit**: YES | Message: `chore(demo): add analytics and scope locks` | Files: `[src/lib/analytics/**/*, src/components/devtools/**/*, scripts/reset-demo.*]`

- [ ] 10. Add end-to-end mobile smoke tests and reviewer handoff notes

  **What to do**: Finalize Vitest coverage for route handlers and domain rules, then implement a Playwright mobile smoke that completes the core path: login -> onboarding -> chart -> AI prompt -> open first match -> send first chat -> export events. Add a concise reviewer handoff note in the repo root describing how to run the demo, which features are intentionally out of scope, and which seeded profile is best for walkthroughs.
  **Must NOT do**: Do not add flaky visual-diff tests. Do not document deferred features as “coming soon” inside the product UI.

  **Recommended Agent Profile**:
  - Category: `unspecified-low` - Reason: test integration and final demo instructions
  - Skills: [`playwright`] - mobile smoke automation required
  - Omitted: [`frontend-ui-ux`] - core UI already done

  **Parallelization**: Can Parallel: NO | Wave 2 | Blocks: none | Blocked By: 1,2,3,4,5,6,7,8,9

  **References**:
  - Product brief: `AI占星+社交App（印尼版）3.docx` - reviewer expectation for main screens
  - Scope analysis: `.sisyphus/drafts/astrology-social-app-analysis.md` - agreed MVP validation route
  - External: `https://playwright.dev/docs/intro` - mobile test configuration reference

  **Acceptance Criteria**:
  - [ ] `npm run test` exits `0`
  - [ ] `npm run e2e:mobile` exits `0`
  - [ ] Reviewer note explains setup, sample profile path, scope exclusions, and reset steps in under 80 lines

  **QA Scenarios**:
  ```text
  Scenario: Core demo loop passes headlessly
    Tool: Playwright
    Steps: Run `npm run e2e:mobile`
    Expected: Script exits 0 and logs `birth_submitted`, `chart_rendered`, `match_opened`, `chat_sent`
    Evidence: .sisyphus/evidence/task-10-e2e.txt

  Scenario: Reset restores clean demo state
    Tool: Bash
    Steps: Run reset utility after event export, then rerun smoke test from login route
    Expected: Previous state is cleared and smoke test still passes from a fresh session
    Evidence: .sisyphus/evidence/task-10-e2e-error.txt
  ```

  **Commit**: YES | Message: `test(demo): add mobile smoke and handoff notes` | Files: `[tests/**/*, playwright/**/*, README.md, scripts/**/*]`

## Final Verification Wave (4 parallel agents, ALL must APPROVE)
- [ ] F1. Plan Compliance Audit - oracle
- [ ] F2. Code Quality Review - unspecified-high
- [ ] F3. Real Manual QA - unspecified-high (+ playwright)
- [ ] F4. Scope Fidelity Check - deep

## Commit Strategy
- Commit after each numbered task to keep rollback surface small.
- Never combine UI polish with business-rule changes in one commit.
- Use conventional commit prefixes exactly as listed in tasks.
- Stop feature work after task 10; any payment/coins/gifts/portrait additions require a separate follow-up plan.

## Success Criteria
- A reviewer can open the demo and reach first chat send in under 5 minutes.
- The demo convincingly shows the MVP thesis without pretending to be production ready.
- All demo state works locally with zero third-party credentials.
- Chart results are deterministic, Indonesian timezone handling is explicit, and AI safety boundaries are demonstrable.
- Forbidden first-launch features are visibly absent from both UI and route surface.
