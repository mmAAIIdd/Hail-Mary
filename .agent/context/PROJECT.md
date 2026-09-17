# Project context

Project: LOCUS CASE 02 — AdmitFlow (AI-сервис персонального маршрута поступления за рубеж)

Status: Phase 1 (Frontend MVP: Landing, 4-Step Profile Questionnaire, Grounded Diagnostic Engine) completed and build-verified.

Purpose: Превратить профиль школьника (8–11 классы) и его цель в понятный персональный маршрут поступления в зарубежные вузы (Bachelor / Undergraduate).

Stack:
- Frontend: React 19, TypeScript, Tailwind CSS, Vite, Lucide Icons.
- Storage: LocalStorage persistence engine (ready for FastAPI + PostgreSQL migration in Phase 2).
- Design System: Custom minimalist clean design (slate/zinc palette, subtle indigo accent, responsive stepper, no excessive AI-slop).

Architecture boundaries:
- `frontend/src/types/profile.ts`: Normalized UserProfile and Diagnostic models.
- `frontend/src/lib/diagnosticEngine.ts`: Deterministic rule-based audit logic separating evidence-grounded strengths, contextual gaps, external constraints, and target goal.
- `frontend/src/lib/storage.ts`: Persistence abstraction.
- `frontend/src/components/landing/`: High-conversion minimalist landing page.
- `frontend/src/components/profile/`: 4-step questionnaire with large readable controls, per-step validation, draft state and demo compatibility.
- `frontend/src/components/diagnosis/`: Diagnostic summary, grounded strengths, contextual gaps, hard constraints, and explainability modal.

Commands:
- `cd frontend && npm install`
- `cd frontend && npm run build`
- `cd frontend && npm run dev`
