# Current state

## 2026-09-19 — Merge recovery and typography polish (ready to publish)

- Resolved the unfinished merge between the local planner/chance-analysis work and the remote Admissions Atlas visual system. Planner, reminders, About/Resources pages, university map and the complete recommendation payload are all preserved.
- Removed the decorative dash before “Персональный маршрут поступления” and increased word spacing in the three About-page principles.
- Frontend production build, API typecheck, Worker dry-run, conflict-marker scan and `git diff --check` passed. Browser UI verification was unavailable because no browser provider or local Playwright installation was exposed.

## 2026-09-19 — My Universities planner, reminders and deeper chance analysis (local)

- A post-questionnaire “Мои университеты” area now stores favorites per local profile. Saving a university creates checklist tasks from its 2–3 AI extracurricular recommendations; users can assign dates, mark completion, write a result note and add their own exam/document/deadline/essay tasks.
- A navigable local calendar shows task counts by day. The nearest incomplete dated task appears as a reminder on the landing page and opens the planner. Data remains browser-local and is cleared with the profile.
- Recommendations now use “Мечта / Реалистичная цель / Резервный вариант”, include 5–8 explained chance factors, a program-specific competition analysis and an acceptance-rate field. Acceptance rate is shown only with an official grounded source; otherwise the product says it was not officially found.
- Fixed a request-boundary bug: `activities`, `additional_context` and `custom_aspects` now reach the Worker instead of being silently omitted from the minimized profile.
- Frontend builds, API typecheck and Worker dry-run passed. Playwright at 390 × 844 verified save → checklist → date/calendar → landing reminder → completion note/count, with no console errors and no landing-page horizontal overflow. Changes are local; response/cache contract is v9.

## 2026-09-19 — University-specific extracurriculars and mobile results (local)

- Every recommended university now includes 2–3 program-specific extracurricular ideas with rationale, a first-30-days plan and evidence to preserve. The UI labels them as personalized strengthening ideas, not official admission requirements.
- The main five-stage roadmap identifies its target university. It uses the applicant's preferred university when that option survives matching; otherwise the model chooses the strongest recommended fit.
- Mobile results now use a horizontal snap list for university selection, stacked comparison blocks, compact timeline markers and tighter reading widths. A 390 × 844 browser fixture confirmed the targeted activities and target roadmap render with no horizontal page overflow or console errors.
- Frontend builds, API typecheck and Worker dry-run passed. Changes are local; the Worker and frontend need a coordinated deployment because the response contract is now v8.

## 2026-09-18 — Preferred university and full roadmap timeline (local)

- The questionnaire now accepts an optional preferred university and sends it through the profile contract. The recommendation prompt treats it as a hypothesis to evaluate against geography, intended program, budget and known preparation rather than automatically raising its score.
- Newly generated plans contain exactly five chronological roadmap stages. Every stage has an objective, a measurable checkpoint and 4–8 detailed tasks with category, deadline, rationale and tangible result.
- The results page renders the roadmap as a numbered vertical timeline that runs from the next seven days through preparation, application submission, status checks, financing and final choice.
- Frontend GitHub Pages build, API typecheck and Worker dry-run passed. Browser automation was unavailable because no browser provider was exposed in the current environment. Changes are local and the production Worker still uses the previous response contract until deployed.

## 2026-09-19 — Admissions Atlas visual system (local)

- Frontend visual language is now documented in `DESIGN.md`.
- Inspo archive recommendation `split-studio` informed a warm editorial admissions-atlas direction.
- Shared visual tokens and accessibility-safe focus/reduced-motion rules live in `frontend/src/index.css`; Tailwind brand colors now use terracotta instead of indigo.
- Landing, navigation, map, questionnaire, diagnosis, admissions workspace, info pages, footer and modal surfaces now share paper/ink/rule/accent treatment.
- Frontend production build passed with 1884 modules transformed.
- Desktop and 390px mobile browser screenshots show the revised hierarchy; mobile document width stays within viewport and console has no warnings/errors.

## 2026-09-18 — Liter, explicit exam scores and sourced campus imagery (local)

- The questionnaire shows a prominent “+ Добавить свои данные” control on its first step and accepts up to six custom aspects.
- IELTS, TOEFL, SAT and ЕНТ each have “Не сдавал(а)” / “Есть результат” states and score inputs constrained to their own scales. The structured values reach the Worker profile and therefore change the v6 cache key and recommendations.
- The interface now uses the original Liter 1.004 webfont from its OFL-licensed repository, bundled locally with the license file.
- The selected university shows a Wikidata P18 image only after an exact university-entity match, then gets the thumbnail, author, license and source page through Wikimedia Commons metadata. If no validated image exists, the UI says so instead of substituting an unrelated photo.
- GitHub Pages-mode frontend build, API typecheck and Worker dry-run passed. The Wikidata/Commons response shape was checked against Harvard University. Changes are not published in this turn.

## 2026-09-18 — Local answer history, university details, deeper personalization

- A bounded five-version history now uses a compact cookie index (IDs and timestamps only) with full plans in localStorage; the results screen can reopen an older answer. Reset clears both. No server-side or cross-device history exists.
- University options now have an explicit “Подробнее” control. The new Worker schema asks for four evidence-aware explanatory fields per university, with safe fallback text for older responses.
- The five-step form includes intended program, school system, achievements and up to six user-defined aspects, on top of the previous academic/exam/activity fields. These reach the Worker schema and prompt. A personalization section explains how input affects recommendations.
- Cache key v5 hashes the complete validated admissions profile, including small field edits and custom aspects. An edit clears the current local plan and triggers a new request; an immaterial edit need not change the university list artificially, but the rationale should reflect meaningful new facts.
- Prompt writing rules were separated into `api/src/recommendationSkills.ts` for questionnaire evidence, university rationale, honest wording and actionable roadmap. Google Search grounding remains disabled, so current factual requirements cannot be claimed verified.
- Frontend build, API typecheck and Worker dry-run passed. Browser flow and live Gemini output with the expanded schema have not been tested. Changes remain local; production Worker ignores new fields until deployed.

## 2026-09-18 — Editable questionnaire and broader preparation (local)

- Results now accept a direct 1,000-character correction; the full questionnaire can also be edited. Saving either clears the local plan and remounts generation for the updated profile.
- The questionnaire has five steps, adding optional subject grades, language level/exam, other exams, current extracurricular activities, interests in research/volunteering/clubs/olympiads/projects/internships, available weekly time and extra context. These fields are included in the API request and validated by the Worker contract.
- The Worker prompt requests detailed exam/grade actions and feasible extracurricular starts in the first week, based on the actual answers. Its cache key was bumped. Exact admissions requirements remain unverified with search disabled.
- Frontend build, API typecheck and Worker dry-run passed. Playwright CLI was unavailable in this environment, so the browser edit flow has not been exercised. Neither frontend nor Worker was published in this turn.

## 2026-09-18 — Softer typography (local)

- Replaced the display Cormorant Garamond with Lora and geometric Manrope with Golos Text across the frontend. Removed global negative letter spacing for more relaxed reading.
- Frontend production build passed. Typography changes are local and have not been pushed or published.

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
