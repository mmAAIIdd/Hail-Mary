# Change history

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

Remaining: wait for the first GitHub Pages workflow run and verify the public URL.

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
