# Hail Mary

Hail Mary — мобильный веб-сервис, который помогает школьнику собрать профиль и получить понятную первичную диагностику для поступления в зарубежный университет.

**Сайт:** [mmaaiidd.github.io/Hail-Mary](https://mmaaiidd.github.io/Hail-Mary/)

## Возможности

- полноэкранный адаптивный лендинг;
- анкета из четырёх последовательных шагов;
- выбор стран, сроков, бюджета, Foundation, стипендий и financial aid;
- понятный разбор сильных сторон, задач на подготовку и условий выбора;
- персональный подбор шести университетов через Gemini с проверкой по открытым источникам;
- сравнение до трёх университетов и пошаговый путь до подачи;
- сохранение заполненного профиля в `localStorage`;
- интерфейс для мобильных и настольных экранов.

## Запуск

```bash
cd frontend
npm install
npm run dev
```

Vite откроет приложение по адресу `http://localhost:3000`.

## Сервис рекомендаций

Gemini вызывается только через Cloudflare Worker из папки `api`. Ключ не попадает в браузерную сборку.

```bash
cd api
npm install
copy .dev.vars.example .dev.vars
# укажите новый GEMINI_API_KEY в .dev.vars
npm run dev
```

Для локального frontend создайте `frontend/.env.local`:

```text
VITE_ADMISSIONS_API_URL=http://127.0.0.1:8787
```

Перед production-деплоем добавьте ключ командой `npx wrangler secret put GEMINI_API_KEY`, разверните Worker и сохраните его URL в GitHub Actions variable `VITE_ADMISSIONS_API_URL`.

## Production-сборка

```bash
cd frontend
npm run build
```

## Технологии

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Lucide React

## Структура

- `frontend/src/components/landing` — главный экран;
- `frontend/src/components/profile` — анкета абитуриента;
- `frontend/src/components/diagnosis` — результат диагностики;
- `frontend/src/components/admissions` — рекомендации, сравнение и путь поступления;
- `frontend/src/lib` — хранение профиля и правила диагностики;
- `api` — защищённый Cloudflare Worker для Gemini;
- `.agent` — роли, skills, workflow и контекст мультимодельной разработки.

Подбор использует данные анкеты без имени и фамилии. Стоимость, сроки и правила необходимо перепроверять по ссылкам на официальные источники в результате.
