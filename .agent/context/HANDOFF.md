# Handoff

USER GOAL: персональные рекомендации университетов, сравнение и путь поступления через Gemini в удобном минималистичном интерфейсе.

CURRENT STATUS: Cloudflare Worker развёрнут, Gemini secret установлен, production API успешно вернул валидный персональный результат; frontend готовится к публикации с URL Worker.

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

NEXT STEP: завершить GitHub Pages workflow и проверить живой путь от анкеты до рекомендаций. Для Google Search grounding позже подключить Gemini Paid Tier и выставить `ENABLE_GOOGLE_SEARCH=true`.
