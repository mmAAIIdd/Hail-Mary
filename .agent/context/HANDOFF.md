# Handoff

LATEST (2026-09-18, follow-up): Fixed the observed blank page by normalizing legacy API output instead of trusting TypeScript casts. Questionnaire completion now immediately starts generation. The results page includes clear active navigation, a plain university list/detail view, comparison table and roadmap. API failures have retry UI and unexpected render failures have a fallback. In model-only mode, generated source links and factual prices/deadlines are not presented as verified. Mocked old/new/error browser flows, frontend build, API check and Worker dry-run passed. The frontend is prepared for GitHub Pages publication; confirm the workflow status after push. The production Worker still predates the expanded schema, and Google Search grounding is off, so fully verified live admissions facts remain unavailable.

NEXT: After the frontend release, test a real generation against the old production Worker for compatibility. Separately test the new Worker schema and validate its cited official pages before Worker deployment. Grounding/billing or a separate trusted source pipeline is required for the user's requested verified, current facts.

LATEST (2026-09-18): The admissions profile is redesigned locally. `DiagnosisView` now hosts the admissions centre, and `AdmissionsWorkspace` presents a left-hand university list with official links and chance rings, a detailed narrative/factor view, and a category-rich roadmap. The Worker schema and prompt require chance explanations, ten roadmap categories and direct source fields; cache/storage versions were bumped. The percentage is a low-confidence heuristic, not measured probability. Frontend build, API check, Worker dry-run and fixture-based browser layout checks passed. The new Gemini response schema has not been verified with a live API request, and no deployment was performed. LOCUS CASE 01's campus-photo product is outside this admissions UI change.

NEXT: Run a live generation against the new Worker contract with a non-demo university and verify official URLs, deadline sourcing, all roadmap categories, generation latency and mobile rendering before deployment. If the user's primary target is the attached visual-profile hackathon case, implement its university search, photo retrieval/verification/deduplication/categorisation and source attribution as a separate scoped feature.

USER GOAL: персональные рекомендации университетов, сравнение и путь поступления через Gemini в удобном минималистичном интерфейсе.

CURRENT STATUS: Cloudflare Worker и frontend опубликованы; публичная анкета успешно получила шесть персональных рекомендаций через production API без ошибок браузера.

REPOSITORY: `https://github.com/mmAAIIdd/Hail-Mary` (`main`).
PUBLIC SITE: `https://mmaaiidd.github.io/Hail-Mary/`.

CURRENT FLOW:
- пользователь проходит четыре шага анкеты;
- введённые ответы нормализуются в компактный `UserProfile`;
- детерминированный движок строит сильные стороны, задачи и условия выбора;
- профиль сохраняется в `localStorage` с версией `v2`.
- пользователь запускает подбор, выбирает до трёх университетов для сравнения и открывает путь подготовки;
- имя и фамилия не отправляются в Gemini;
- результат сохраняется локально для текущей версии анкеты.

KEY FILES:
- `frontend/src/components/profile/Questionnaire.tsx`
- `frontend/src/types/profile.ts`
- `frontend/src/lib/storage.ts`
- `frontend/src/lib/diagnosticEngine.ts`
- `frontend/src/components/diagnosis/DiagnosisView.tsx`
- `frontend/src/components/admissions/AdmissionsWorkspace.tsx`
- `frontend/src/lib/admissionsApi.ts`
- `frontend/src/types/admissions.ts`
- `api/src/index.ts`
- `api/src/contracts.ts`
- `api/src/prompt.ts`

REMOVED:
- `frontend/src/lib/demoData.ts`;
- демо-кнопки в шапке, мобильном меню и лендинге;
- обработчики загрузки демо;
- старые поля экзаменов, GPA, активностей, достижений и дополнительных предпочтений.

VALIDATION:
- production build passed;
- full questionnaire flow passed in Playwright;
- result stored only real questionnaire fields;
- desktop and mobile navigation verified;
- zero browser console errors and warnings.
- GitHub Pages workflow run `35352260885` completed successfully; the public page was checked after deployment.

NEXT STEP: для Google Search grounding подключить Gemini Paid Tier и выставить `ENABLE_GOOGLE_SEARCH=true`. Текущий model-only режим уже работает и просит пользователя перепроверять изменяемые данные.
