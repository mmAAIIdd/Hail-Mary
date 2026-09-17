# Hail Mary

Hail Mary — мобильный веб-сервис, который помогает школьнику собрать профиль и получить понятную первичную диагностику для поступления в зарубежный университет.

**Сайт:** [mmaaiidd.github.io/Hail-Mary](https://mmaaiidd.github.io/Hail-Mary/)

## Возможности

- полноэкранный адаптивный лендинг;
- анкета из четырёх последовательных шагов;
- выбор стран, сроков, бюджета, Foundation, стипендий и financial aid;
- понятный разбор сильных сторон, задач на подготовку и условий выбора;
- демо-профили для быстрого просмотра;
- сохранение заполненного профиля в `localStorage`;
- интерфейс для мобильных и настольных экранов.

## Запуск

```bash
cd frontend
npm install
npm run dev
```

Vite откроет приложение по адресу `http://localhost:3000`.

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
- `frontend/src/lib` — хранение профиля и правила диагностики;
- `.agent` — роли, skills, workflow и контекст мультимодельной разработки.

Сейчас проект работает как frontend MVP. Серверная часть и каталог университетов для персонального подбора запланированы на следующий этап.
