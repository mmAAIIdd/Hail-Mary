# Change history

## 2026-09-19 — Admissions Atlas visual system

Goal: enhance the entire frontend with a coherent design language informed by the Inspo archive.

Changed: added `DESIGN.md`; introduced warm paper/ink/terracotta tokens, editorial focus states, reduced-motion handling and light depth in `frontend/src/index.css`; updated Tailwind theme colors; refreshed app shell, header, footer, landing hero ledger, geography section, questionnaire surface, diagnosis, admissions workspace and modal surfaces with shared visual hooks.

Reason: move from restrained generic utility styling to a memorable admissions-atlas identity while preserving the existing cardless information architecture and truthful recommendation states.

Validation: `npm.cmd run build` passed with 1884 modules transformed. Browser screenshots checked at default desktop and 390px mobile widths; mobile overflow check passed and browser console had zero warnings/errors.

Remaining: none for this visual pass; physical-device font rendering can still vary.

## 2026-09-18 — Exam results, Liter typography and sourced university images

Moved the custom-data button to the first questionnaire step, added structured IELTS/TOEFL/SAT/ЕНТ scores with a not-taken state and exam-specific validation, self-hosted the requested Liter font, and added sourced university imagery through exact Wikidata matching plus Commons metadata. Validated Pages build, API types and Worker dry-run; not deployed.


## 2026-09-18 — History and explained university recommendations

Added compact cookie-indexed history with local full-plan snapshots, university detail expansion, richer applicant and custom-aspect inputs, model personalization explanations, and modular prompt-writing rules for evidence, text and roadmap. Updated API contract and cache version. Frontend build, API typecheck and Worker dry-run passed; not deployed.


## 2026-09-18 — Profile corrections and actionable roadmap input

Added direct post-questionnaire corrections and full profile editing with fresh recommendation generation. Expanded the questionnaire/API contract with optional academic, exam and extracurricular context; guided the Worker to include concrete near-term exam and extracurricular actions. Bumped the Worker cache key. Frontend build, API typecheck and dry-run passed; not published.


## 2026-09-18 — Softer typography

Switched the site-wide heading font from Cormorant Garamond to Lora and body font from Manrope to Golos Text; removed tight global letter spacing and unused font downloads. Frontend build passed. Not published yet.


## 2026-09-18 — Immediate results and truthful failure states

Made recommendation generation automatic on questionnaire completion; added legacy-response normalization, API error/retry UI and a render fallback. Replaced card-heavy result layout with a university list, narrative analysis, six-way comparison and plain roadmap. Made active page visible in navigation/title. Model-only responses no longer surface AI-supplied URLs or unsupported cost/deadline claims as verified facts. Validated old/new/error responses in Playwright and built frontend/Worker locally. Worker deployment intentionally deferred until a live generation test.

## 2026-09-18 — Admissions centre replaces the prior diagnosis view

Removed the old strengths/gaps/constraints presentation and old comparison tabs. Added a two-column university/recommendation analysis, per-university chance diagrams with factor explanations, direct university links, a comprehensive stage-based roadmap and source/uncertainty messaging. Expanded the Worker and frontend response contracts; versioned the plan storage and cache. Updated landing/navigation copy. Verified frontend build, API typecheck, Worker dry-run and fixture-based browser layout at desktop/mobile. Live Gemini generation with the expanded schema was not tested and nothing was deployed.

## 2026-09-18 — Personal university recommendations and application path

Goal: add grounded Gemini recommendations, university comparison and a personal preparation path without exposing the API key or adding decorative AI copy.

Changed: added the `api/` Cloudflare Worker with input/output validation, CORS, rate limiting, caching and structured Gemini output; added frontend API/storage contracts and a responsive recommendations workspace with six university cards, three-way comparison, roadmap stages, next actions and sources; replaced the static example-university modal; added deployment configuration and documentation. Updated the production model to Gemini 3.6 Flash with Flash Lite fallbacks and made Google Search grounding opt-in for paid quota.

Validation: frontend production build passed with 1603 modules; API type check and Wrangler deployment passed; API returned 400 for malformed data, 403 for a disallowed origin and 503 without a server secret; Playwright verified recommendations, comparison and roadmap on desktop and 390 × 844 with no overflow or console errors for a valid response fixture. The production Worker health check returned 200, and a live Gemini request returned 6 universities, 3 roadmap stages and 6 sources through the automatic `gemini-3.5-flash-lite` fallback. GitHub Pages workflow `35360706771` succeeded, and Playwright completed the public questionnaire and received all six production recommendations with zero console errors or warnings.

Remaining: Google Search grounding requires Gemini Paid Tier; model-only responses explicitly require verification on official sites. The user-provided key was never stored or committed because it was exposed in chat; the active rotated key exists only as a Cloudflare secret.

## 2026-09-18 — Demo removal and profile cleanup

Goal: remove the demo profile completely and retire remnants of the older oversized profile model.

Changed: removed `frontend/src/lib/demoData.ts`, all demo buttons and handlers; reduced `UserProfile` to the fields collected by the current questionnaire; simplified questionnaire mapping, diagnostics and result rendering; added validated `hail_mary_profile_v2` storage and cleanup of old stored records; updated README and project context.

Reason: ensure every result comes from the user's answers and keep the code aligned with the visible four-step form.

Validation: production build passed with 1600 modules; Playwright completed the full questionnaire, confirmed the compact stored academics object, verified old storage cleanup, checked the 390 × 844 mobile menu and found zero console errors or warnings.

Publishing: commit `750db3b` was deployed successfully by GitHub Pages workflow run `35352260885`; the public landing page was checked with zero console errors or warnings.

## 2026-09-17 — University landing background

Goal: replace the separate study image with a full landing background based on the supplied historic university scene and improve text readability.

Changed: generated `frontend/public/university-campus-hero.png`; rebuilt `LandingView.tsx` around a full-viewport background, layered overlays and white content placed directly over the image; removed the previous hero card and `frontend/public/hero-study.png`.

Validation: `npm run build` passed; Playwright screenshots checked at desktop and 390 × 844 mobile viewports.

Remaining: image generation preserved the scene and composition but produced an adapted asset rather than the exact uploaded bytes.

## 2026-09-17 — Stable responsive hero rendering

Goal: fix the collapsed wide-screen hero and disappearing text shown in the browser screenshot.

Changed: replaced negative stacking and `svh` sizing with an explicit CSS background, positive content layers and stable `vh` fallbacks; removed compositing-heavy backdrop filters and text shadows; simplified the mobile header; converted the 2.15 MB PNG background to a 297 KB JPEG.

Validation: `npm run build` passed. Full-page Playwright screenshots at 1840 × 942 and 390 × 844 show the complete hero, all white text and both CTAs. Browser console has no application errors.

## 2026-09-17 — Editorial hero typography

Goal: remove generic AI-style iconography and make the hero feel designed rather than templated.

Changed: removed circular check icons and the pill badge; replaced benefits with restrained 01/02 markers and vertical rules; changed the headline to the project serif family; reduced body weight; squared the CTA radii and simplified the time label.

Validation: `npm run build` passed. Playwright desktop and 390 × 844 mobile screenshots show readable text, clear hierarchy and no overflow.

## 2026-09-17 — Hero content reduction

Goal: remove the two benefit-marker objects and the completion-time label entirely.

Changed: deleted both 01/02 benefit blocks and the `4–5 минут на заполнение` label from `LandingView.tsx`; retained only the value proposition and primary actions.

Validation: `npm run build` passed.

Record significant changes only. For each entry include date, goal, changed paths, reason, validation and remaining issue. Do not copy full diffs or logs here; use Git history when a future project has Git.

## 2026-09-18 — Production polish and GitHub Pages

Goal: turn the repository into a complete public site with concise product copy and reliable automatic deployment.

Changed: added the Pages workflow, repository-aware Vite base path, favicon and social metadata; simplified result, advice and university copy; rebuilt diagnosis around fields the questionnaire actually collects; removed the unused API environment example and updated project naming.

Reason: avoid broken assets under `/Hail-Mary/`, remove technical template language, avoid stale university claims, and stop showing missing IELTS/SAT as problems when those questions were never asked.

Validation: Pages-mode production build passed. Local production preview at `/Hail-Mary/` loaded every asset with zero console errors. A fresh four-step profile completed successfully at 390 × 844 with no horizontal overflow and no IELTS/SAT warnings in the result.

Remaining: none for the current deployment scope. The public URL was verified after the Node 24 workflow completed.

## 2026-09-17 — GitHub repository publication

Goal: publish the complete Hail Mary project to `mmAAIIdd/Hail-Mary` on GitHub.

Changed: initialized Git from the existing remote `main`, expanded `.gitignore` for build and browser artifacts, and replaced the generic agent-system README with project setup and capability documentation.

Reason: provide a clean, reproducible public source repository without local dependencies, environment files or QA artifacts.

Validation: staged-file audit found no `node_modules`, build output, environment secrets, Playwright artifacts or TypeScript build metadata. The frontend production build had already passed before publication.

Remaining: frontend hosting is separate from source publication and has not been configured.

## 2026-09-17 — Full mobile adaptation

Goal: make the complete site usable on narrow mobile screens rather than adapting only the landing page.

Changed: added a touch-friendly mobile menu in `Header.tsx`; tuned viewport height and type scaling in `LandingView.tsx`; increased diagnostic card readability in `DiagnosisView.tsx`; converted all modals into scrollable mobile bottom sheets; simplified and wrapped `Footer.tsx` content.

Reason: mobile users previously could not reach advice or universities from the header, and diagnostic and modal text was too dense at phone sizes.

Validation: production build passed. Playwright checks at 320 × 700 confirmed navigation, landing, questionnaire, diagnosis and tips modal have no horizontal overflow; console errors and warnings were zero. Desktop check at 1440 × 900 confirmed the mobile menu is hidden and layout remains stable.

Remaining: device-specific visual QA on physical iOS and Android hardware can still refine browser chrome and font rendering.

## 2026-09-17 — Four-step applicant questionnaire

Goal: replace the long technical profile form with a short, understandable survey covering identity, school context, goals and financial requirements.

Changed: rebuilt `frontend/src/components/profile/Questionnaire.tsx`; extended `frontend/src/types/profile.ts` and both presets in `frontend/src/lib/demoData.ts`; updated `frontend/src/lib/diagnosticEngine.ts` and `frontend/src/components/diagnosis/DiagnosisView.tsx`; removed the eight unused legacy step components.

Reason: give applicants larger readable controls, explain unfamiliar terms and keep each screen focused on one decision group.

Validation: production build passed; Playwright completed all four steps, verified required-field validation and persisted output, and found zero console errors. Desktop and 390 × 844 mobile layouts were visually checked.

Remaining: university matching still uses the existing Phase 1 deterministic engine and dataset scope.

## 2026-09-17 — Agent-system template

Goal: prepare a shared multimodel coding workflow before the product is named.

Changed: root entrypoints and `.agent/` roles, skills, tools, workflow and context files.

Reason: keep reusable agent procedures and lossless handoff in one place while loading only task-relevant instructions.

Validation: all six skills passed `quick_validate.py`; expected files and entrypoint references were inspected. No product tests apply yet.

Remaining: real Claude/Codex/Gemini continuation and product checks await a concrete project.

## 2026-09-17 — Phase 1: LOCUS CASE 02 AdmitFlow Frontend MVP

Goal: Deliver clean, minimalist, responsive user interface covering Landing, 8-step Profile Questionnaire, and Grounded Diagnosis without backend.

Changed:
- `frontend/package.json`, `vite.config.ts`, `tsconfig.json`, `tailwind.config.js`, `postcss.config.js`, `index.html`
- `frontend/src/types/profile.ts`: Normalized UserProfile and Diagnostic types
- `frontend/src/lib/storage.ts`: LocalStorage profile persistence
- `frontend/src/lib/demoData.ts`: Realistic demo profiles (CS and Business applicants)
- `frontend/src/lib/diagnosticEngine.ts`: Grounded rule-based diagnostic engine
- `frontend/src/components/layout/Header.tsx`, `Footer.tsx`
- `frontend/src/components/landing/LandingView.tsx`
- `frontend/src/components/profile/Questionnaire.tsx` + 8 modular steps
- `frontend/src/components/diagnosis/DiagnosisView.tsx` + `ExplainModal.tsx`
- `frontend/src/App.tsx`, `src/index.css`, `src/main.tsx`
- `.gitignore`, `frontend/.env.example`

Reason: Fulfill hackathon requirements for LOCUS CASE 02 with a complete vertical user journey from landing to diagnosis, avoiding AI hallucinations and ungrounded advice.

Validation: `npm run build` ran clean with zero TypeScript errors and produced production bundles. Verified stepper navigation, 8-step input handling, demo autofill, and explainability modals.

Remaining: Universities catalog, comparison matrix, roadmap engine, and FastAPI backend integration scheduled for subsequent phase.

## 2026-09-17 — Landing redesign matching user Photo 3 & Photo 2 asset

Goal: Simplify landing layout to match editorial 2-column aesthetic (Photo 3):
- Replaced headline with: "Ваш roadmap по поступлению"
- Subtitle: "Чтобы начать пройдите анкету"
- Removed all "AI-slop" elements: purple/indigo/deep blue gradients and sparkle icons, switching to an editorial monochrome design system (slate/black/white)
- Added top navigation items: "Советы" (modal with verified admission tips) and "Университеты" (modal with verified programs)
- Replaced brand name with "Hail Mary" set in luxury editorial Cormorant Garamond typography
- Build verified with `npm run build` (exit 0).
