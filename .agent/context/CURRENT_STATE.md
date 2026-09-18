# Current state

Status: Hail Mary frontend MVP работает и опубликован.

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

Validation:
- `npm run build`: passed, 1600 modules transformed.
- Playwright: полный путь анкеты прошёл до результата.
- Desktop and 390 × 844 mobile navigation contain no demo controls.
- Browser console: zero errors and zero warnings.
- Old profile storage key is removed after reload.

Not implemented:
- подбор и сравнение университетов;
- персональный план действий;
- backend and database.
