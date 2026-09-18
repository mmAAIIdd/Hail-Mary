# Handoff

USER GOAL: минимальный сервис диагностики поступления без демо-профилей и старой модели данных.

CURRENT STATUS: реализовано и проверено локально.

REPOSITORY: `https://github.com/mmAAIIdd/Hail-Mary` (`main`).
PUBLIC SITE: `https://mmaaiidd.github.io/Hail-Mary/`.

CURRENT FLOW:
- пользователь проходит четыре шага анкеты;
- введённые ответы нормализуются в компактный `UserProfile`;
- детерминированный движок строит сильные стороны, задачи и условия выбора;
- профиль сохраняется в `localStorage` с версией `v2`.

KEY FILES:
- `frontend/src/components/profile/Questionnaire.tsx`
- `frontend/src/types/profile.ts`
- `frontend/src/lib/storage.ts`
- `frontend/src/lib/diagnosticEngine.ts`
- `frontend/src/components/diagnosis/DiagnosisView.tsx`

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

NEXT PRODUCT STEP: начать подбор университетов только после отдельного запроса пользователя.
