# Hail Mary

Мобильный веб-сервис для школьников 8–11 классов, который помогает собрать профиль абитуриента, определить ближайшие задачи и получить понятный маршрут подготовки к поступлению за рубеж.

**Публичный сайт:** [mmaaiidd.github.io/Hail-Mary](https://mmaaiidd.github.io/Hail-Mary/)

## Задача

Школьнику сложно сопоставить интересы, профильный предмет, GPA, страны, сроки и бюджет с реальными требованиями университетов. Hail Mary превращает эти данные в последовательную анкету, первичную диагностику, подбор университетов и roadmap до подачи документов.

## Решение

- адаптивный лендинг с интерактивной картой мира и университетскими маркерами;
- последовательная анкета с выбором интересов, профильного предмета, GPA, стран, сроков и бюджета;
- локальное сохранение профиля в `localStorage`;
- детерминированная первичная диагностика сильных сторон, пробелов и ограничений;
- подбор шести университетов через Gemini и защищённый Cloudflare Worker;
- сравнение до трёх университетов и план подготовки по этапам;
- разделы «О нас» и «Ресурсы» с внешними источниками для самостоятельной проверки.

## Техническая справка

| Раздел | Описание |
| --- | --- |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, Lucide React |
| Карта | `react-simple-maps`, TopoJSON World Atlas, реальные координаты университетов |
| Шрифт | Локальный `Liter-Regular.ttf` без зависимости от CDN |
| Хранение | Версионированный профиль и результат рекомендаций в `localStorage` |
| Backend | Cloudflare Worker в `api`, валидация Zod, CORS, rate limit и кеширование |
| AI | Gemini вызывается только Worker-ом; ключ не попадает в браузерную сборку |
| Публикация | GitHub Pages для frontend, Cloudflare Workers для API |

## Структура

- `frontend/src/components/landing` — лендинг и карта университетов;
- `frontend/src/components/profile` — анкета абитуриента;
- `frontend/src/components/diagnosis` — первичная диагностика;
- `frontend/src/components/admissions` — рекомендации, сравнение и roadmap;
- `frontend/src/components/info` — страницы «О нас» и «Ресурсы»;
- `frontend/src/lib` — storage, правила диагностики и API-клиент;
- `api/src` — Worker, контракты и prompt для Gemini;
- `.github/workflows` — сборка и публикация GitHub Pages.

## Запуск frontend

```bash
cd frontend
npm install
npm run dev
```

Vite откроет приложение на `http://localhost:3000`.

Для локального frontend с production Worker используется `frontend/.env.local`:

```text
VITE_ADMISSIONS_API_URL=https://hail-mary-admissions-api.hail-mary-admissions-api.workers.dev
```

## Запуск Worker

```bash
cd api
npm install
copy .dev.vars.example .dev.vars
```

В `.dev.vars` укажите новый `GEMINI_API_KEY`, затем:

```bash
npm run dev
```

Для подключения локального Worker замените адрес в `frontend/.env.local` на `http://127.0.0.1:8787`.

## Проверка

```bash
cd frontend
npm run build

cd ../api
npm run check
```

Минимальный сценарий проверки: открыть лендинг, пройти все шаги анкеты, проверить сохранение профиля в браузере и дождаться результата рекомендаций. Дополнительно проверить отображение интерфейса на мобильном и настольном экране.

## Ограничения и безопасность

В Gemini отправляются только данные анкеты без имени и фамилии. Стоимость, сроки, правила визы и требования программ необходимо перепроверять по официальным ссылкам. Без Gemini Paid Tier Google Search grounding отключён, поэтому model-only результат не считается подтверждённым веб-исследованием.
