# Current state

Status: основной frontend опубликован; новый модуль рекомендаций проверен локально и ожидает серверные credentials для production.

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

Pending production setup:
- complete Cloudflare OAuth;
- set a newly issued Gemini auth key as Worker secret;
- deploy Worker and set GitHub variable `VITE_ADMISSIONS_API_URL`;
- publish the updated frontend.
