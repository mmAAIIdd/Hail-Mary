# Project context

Project: Hail Mary — сервис первичной диагностики для поступления в зарубежный университет.

Status: frontend MVP опубликован; персональные рекомендации и серверный Gemini API реализованы локально и готовы к публикации после настройки секретов.

Purpose: помочь школьнику 8–11 класса собрать исходные данные и получить понятный первый разбор сильных сторон, задач и ограничений.

Stack:
- React 19, TypeScript, Tailwind CSS, Vite, Lucide React.
- `localStorage` для сохранения заполненной анкеты.
- GitHub Actions и GitHub Pages для публикации.
- Cloudflare Worker для защищённого вызова Gemini API.
- Gemini 2.5 Flash, Google Search grounding и структурированный JSON-ответ.

Architecture boundaries:
- `frontend/src/types/profile.ts`: компактная модель реальной анкеты и результата.
- `frontend/src/lib/diagnosticEngine.ts`: детерминированные правила по ответам пользователя.
- `frontend/src/lib/storage.ts`: проверяемое версионированное хранение профиля.
- `frontend/src/components/landing/`: главный экран.
- `frontend/src/components/profile/`: анкета из четырёх шагов.
- `frontend/src/components/diagnosis/`: итоговая диагностика.
- `frontend/src/components/admissions/`: рекомендации, сравнение и путь поступления.
- `api/`: валидация, кеширование, Gemini-вызов и CORS API.

Commands:
- `cd frontend && npm install`
- `cd frontend && npm run build`
- `cd frontend && npm run dev`
- `cd api && npm install && npm run dev`
