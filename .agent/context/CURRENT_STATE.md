# Current state

## 2026-09-18 — Automatic recommendations and blank-screen fix

- Finishing the four-step questionnaire now opens recommendations and starts generation automatically; there is no intermediate generate button.
- The frontend normalizes both the old deployed Worker response and the expanded response. Missing chance data shows an honest no-estimate state instead of crashing. API failure shows a retry path; a render error boundary prevents a completely blank screen.
- Main navigation and browser title identify the current page. Recommendations, a six-option comparison table and the roadmap share one editorial page without decorative card grids.
- In `model_only` mode, the frontend suppresses AI-supplied source URLs, exact cost/deadline assertions and other unsupported facts. The updated Worker prompt and output sanitizer do the same when deployed. Paid Google Search grounding remains disabled, so live fact verification is not yet available.
- Browser checks with mocked legacy/new/error responses passed: automatic transition, comparison, retry state, active navigation, no React console errors in successful flows and no horizontal overflow at 390px/1440px. Frontend build, API typecheck and Worker dry-run passed. The frontend is intended for GitHub Pages release; the changed Worker has not been deployed.

## 2026-09-18 — Admissions centre redesign (local, not deployed)

- The old diagnosis cards have been replaced by a single admissions-centre view. The left column lists six recommended universities, individual illustrative chance diagrams and links supplied as official university sites; selecting one opens a textual analysis with factors, risks, costs and a deadline note.
- The roadmap now has stages, ten requested categories, per-task timing and expected outcomes. A factual task or university deadline shows its direct source when supplied, otherwise an explicit verification warning.
- Admission percentages are non-calibrated estimates from the sparse questionnaire, not statistical probabilities or guarantees. The Worker forces low confidence because exact grades, exams and documents are not collected. Model-only research remains explicitly unverified.
- Frontend build, API typecheck and Worker dry-run passed. A browser fixture verified university switching, zero console errors and no horizontal overflow at 1440px and 390px. The production generation path with the new schema has not yet been exercised against Gemini or deployed.
- The supplied LOCUS CASE 01 describes a separate 30-second visual campus profile. This change implements the requested admissions centre, not photo search, deduplication, visual provenance or campus categories.

Status: frontend и Cloudflare Worker опубликованы; production путь от анкеты до персональных Gemini-рекомендаций проверен в браузере.

Working:
1. Полноэкранный адаптивный лендинг с одним основным действием — пройти анкету.
2. Навигация с советами, информацией об университетах, переходом к своей диагностике и сбросом профиля.
3. Анкета из четырёх шагов:
   - имя, фамилия, класс и возраст;
   - интересы, главный предмет и успеваемость;
   - страны, сроки подачи и Foundation;
   - бюджет, стипендия, financial aid и работа во время учёбы.
4. Результат строится только из ответов пользователя и не создаёт скрытые оценки, экзамены, достижения или активности.
5. Профиль сохраняется под ключом `hail_mary_profile_v2`; устаревшие записи очищаются при загрузке.
6. Демо-профили, их элементы интерфейса, обработчики и данные удалены.
7. GitHub Pages: `https://mmaaiidd.github.io/Hail-Mary/`.
8. Новый модуль рекомендаций:
   - 6 персональных университетов в трёх категориях соответствия;
   - сравнение до трёх вариантов;
   - путь подготовки по срокам пользователя;
   - официальные источники и явные пункты для перепроверки;
   - локальное сохранение результата без повторного расхода запросов.
9. Cloudflare Worker принимает только минимизированную анкету без имени и фамилии, проверяет вход и Gemini-ответ, ограничивает частоту запросов и кеширует результат на 6 часов.

Validation:
- `npm run build`: passed, 1600 modules transformed.
- Playwright: полный путь анкеты прошёл до результата.
- Desktop and 390 × 844 mobile navigation contain no demo controls.
- Browser console: zero errors and zero warnings.
- Old profile storage key is removed after reload.
- Frontend production build with API URL: passed, 1603 modules.
- API `tsc --noEmit` and `wrangler deploy --dry-run`: passed.
- Playwright: recommendations, comparison and roadmap checked at desktop and 390 × 844; no horizontal overflow or console errors with a valid response fixture.
- API boundary: malformed profile returns 400, disallowed origin returns 403, missing server secret returns 503.
- Production Worker health returns 200; реальный запрос вернул 6 университетов, 3 этапа пути и 6 источников.
- При перегрузке Gemini 3.6 Flash запрос успешно переключился на `gemini-3.5-flash-lite`.
- GitHub Pages workflow `35360706771` завершился успешно; публичная анкета получила шесть рекомендаций через production Worker без ошибок консоли.

Pending production setup:
- enable Gemini billing before turning on Google Search grounding.
