import React, { useMemo, useState } from 'react';
import { CalendarDays, Check, ChevronLeft, ChevronRight, Heart, Plus, Trash2 } from 'lucide-react';
import { loadAdmissionsPlan } from '../../lib/admissionsStorage';
import {
  addPlannerTask,
  loadPlannerState,
  removePlannerTask,
  toggleFavoriteUniversity,
  updatePlannerTask,
} from '../../lib/plannerStorage';
import { UserProfile } from '../../types/profile';
import { PlannerState, PlannerTask, PlannerTaskCategory } from '../../types/planner';

interface MyUniversitiesViewProps {
  profile: UserProfile;
  onGoToRecommendations: () => void;
}

const categoryLabels: Record<PlannerTaskCategory, string> = {
  extracurricular: 'Extracurricular',
  exam: 'Экзамен',
  documents: 'Документы',
  deadline: 'Дедлайн',
  essay: 'Эссе',
  other: 'Другое',
};

const weekdayLabels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

function dateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function monthCells(month: Date): Array<Date | null> {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const offset = (first.getDay() + 6) % 7;
  const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells: Array<Date | null> = Array.from({ length: offset }, () => null);
  for (let day = 1; day <= count; day += 1) cells.push(new Date(month.getFullYear(), month.getMonth(), day));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function TaskRow({ task, profileId, onChange }: { task: PlannerTask; profileId: string; onChange: (state: PlannerState) => void }) {
  return (
    <li className="border-t border-slate-200 py-5 first:border-t-0">
      <div className="flex items-start gap-3">
        <button
          type="button"
          aria-label={task.completed ? `Вернуть задачу «${task.title}» в работу` : `Отметить задачу «${task.title}» выполненной`}
          onClick={() => onChange(updatePlannerTask(profileId, task.id, { completed: !task.completed }))}
          className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border ${task.completed ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-400 bg-white text-transparent'}`}
        >
          <Check className="h-4 w-4" aria-hidden="true" />
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{categoryLabels[task.category]} · {task.university_name}</p>
              <h3 className={`mt-1 text-sm font-semibold leading-6 ${task.completed ? 'text-slate-500 line-through' : 'text-slate-950'}`}>{task.title}</h3>
            </div>
            {task.source === 'custom' && (
              <button type="button" onClick={() => onChange(removePlannerTask(profileId, task.id))} className="inline-flex min-h-9 items-center gap-1 self-start text-xs font-semibold text-slate-500 hover:text-rose-700">
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Удалить
              </button>
            )}
          </div>
          {task.description && <p className="mt-2 text-sm leading-6 text-slate-600">{task.description}</p>}
          <div className="mt-4 grid gap-3 sm:grid-cols-[190px_minmax(0,1fr)]">
            <label className="text-xs font-semibold text-slate-600">Дата
              <input type="date" value={task.due_date} onChange={(event) => onChange(updatePlannerTask(profileId, task.id, { due_date: event.target.value }))} className="mt-1 h-11 w-full border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-950" />
            </label>
            <label className="text-xs font-semibold text-slate-600">Что сделано / результат
              <textarea value={task.completion_note} maxLength={500} rows={2} onChange={(event) => onChange(updatePlannerTask(profileId, task.id, { completion_note: event.target.value }))} placeholder="Например: собрал данные, провёл 2 занятия, прикрепил работу в портфолио" className="mt-1 w-full border border-slate-300 bg-white px-3 py-2 text-sm leading-5 outline-none focus:border-slate-950" />
            </label>
          </div>
        </div>
      </div>
    </li>
  );
}

export const MyUniversitiesView: React.FC<MyUniversitiesViewProps> = ({ profile, onGoToRecommendations }) => {
  const plan = useMemo(() => loadAdmissionsPlan(profile), [profile]);
  const [planner, setPlanner] = useState(() => loadPlannerState(profile.id));
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(() => dateKey(new Date()));
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<PlannerTaskCategory>('deadline');
  const [universityId, setUniversityId] = useState('');
  const [dueDate, setDueDate] = useState('');

  if (!plan) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Личный кабинет</p>
        <h1 className="mt-2 font-brand text-3xl font-semibold text-slate-950 sm:text-5xl">Мои университеты</h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600">Сначала получите рекомендации. После этого здесь появятся избранные университеты, AI-чеклист и календарь.</p>
        <button type="button" onClick={onGoToRecommendations} className="mt-6 min-h-11 bg-slate-950 px-5 text-sm font-semibold text-white">Перейти к рекомендациям</button>
      </main>
    );
  }

  const favoriteUniversities = plan.universities.filter((university) => planner.favorite_university_ids.includes(university.id));
  const visibleTasks = planner.tasks.filter((task) => planner.favorite_university_ids.includes(task.university_id) || task.source === 'custom');
  const completedCount = visibleTasks.filter((task) => task.completed).length;
  const selectedDateTasks = visibleTasks.filter((task) => task.due_date === selectedDate);
  const tasksByDate = new Map<string, number>();
  visibleTasks.forEach((task) => {
    if (task.due_date) tasksByDate.set(task.due_date, (tasksByDate.get(task.due_date) ?? 0) + 1);
  });

  const submitTask = (event: React.FormEvent) => {
    event.preventDefault();
    const university = plan.universities.find((item) => item.id === universityId) ?? favoriteUniversities[0];
    if (!title.trim() || !university) return;
    setPlanner(addPlannerTask(profile.id, {
      university_id: university.id,
      university_name: university.name,
      program_name: university.program_name,
      title: title.trim(),
      description: '',
      category,
      due_date: dueDate,
    }));
    setTitle('');
    setDueDate('');
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
      <header className="border-b border-slate-300 pb-7">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Личный центр поступления</p>
        <h1 className="mt-2 font-brand text-3xl font-semibold leading-tight text-slate-950 sm:text-5xl">Мои университеты</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">Сохраняйте варианты, превращайте рекомендации в задачи, назначайте даты и отмечайте реальный прогресс.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="border-t border-slate-300 pt-3"><span className="text-2xl font-semibold text-slate-950">{favoriteUniversities.length}</span><p className="text-xs text-slate-500">в избранном</p></div>
          <div className="border-t border-slate-300 pt-3"><span className="text-2xl font-semibold text-slate-950">{visibleTasks.length}</span><p className="text-xs text-slate-500">задач</p></div>
          <div className="border-t border-slate-300 pt-3"><span className="text-2xl font-semibold text-slate-950">{completedCount}</span><p className="text-xs text-slate-500">выполнено</p></div>
        </div>
      </header>

      <section className="mt-9" aria-labelledby="favorite-title">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Подборка</p><h2 id="favorite-title" className="mt-1 font-brand text-2xl font-semibold text-slate-950">Выберите университеты</h2></div>
          <button type="button" onClick={onGoToRecommendations} className="min-h-11 text-sm font-semibold text-slate-700 underline underline-offset-4">Открыть полный разбор</button>
        </div>
        <div className="mt-5 -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-3 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3">
          {plan.universities.map((university) => {
            const favorite = planner.favorite_university_ids.includes(university.id);
            return (
              <article key={university.id} className={`min-w-[80vw] snap-start border p-4 sm:min-w-0 ${favorite ? 'border-slate-950 bg-white' : 'border-slate-200 bg-slate-50'}`}>
                <p className="text-xs text-slate-500">{university.country} · {university.program_name}</p>
                <h3 className="mt-2 text-base font-semibold leading-6 text-slate-950">{university.name}</h3>
                <button type="button" onClick={() => setPlanner(toggleFavoriteUniversity(profile.id, university))} className={`mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold ${favorite ? 'text-rose-700' : 'text-slate-700'}`}>
                  <Heart className={`h-4 w-4 ${favorite ? 'fill-current' : ''}`} aria-hidden="true" /> {favorite ? 'В избранном' : 'Добавить'}
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <div className="mt-12 grid gap-12 xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)]">
        <section aria-labelledby="checklist-title">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Рабочий план</p>
          <h2 id="checklist-title" className="mt-1 font-brand text-2xl font-semibold text-slate-950">Мой чеклист</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">AI-задачи появляются после добавления университета в избранное. Даты и отметки хранятся только в этом браузере.</p>

          <form onSubmit={submitTask} className="mt-6 border-y border-slate-300 py-5">
            <h3 className="text-sm font-semibold text-slate-950">Добавить свою задачу</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="text-xs font-semibold text-slate-600 sm:col-span-2">Задача
                <input value={title} maxLength={180} onChange={(event) => setTitle(event.target.value)} placeholder="Например, зарегистрироваться на IELTS" className="mt-1 h-11 w-full border border-slate-300 bg-white px-3 text-sm outline-none focus:border-slate-950" />
              </label>
              <label className="text-xs font-semibold text-slate-600">Университет
                <select value={universityId} onChange={(event) => setUniversityId(event.target.value)} className="mt-1 h-11 w-full border border-slate-300 bg-white px-3 text-sm outline-none focus:border-slate-950">
                  <option value="">{favoriteUniversities.length > 0 ? 'Выберите университет' : 'Сначала добавьте университет'}</option>
                  {favoriteUniversities.map((university) => <option key={university.id} value={university.id}>{university.name}</option>)}
                </select>
              </label>
              <label className="text-xs font-semibold text-slate-600">Категория
                <select value={category} onChange={(event) => setCategory(event.target.value as PlannerTaskCategory)} className="mt-1 h-11 w-full border border-slate-300 bg-white px-3 text-sm outline-none focus:border-slate-950">
                  {Object.entries(categoryLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </label>
              <label className="text-xs font-semibold text-slate-600">Дата
                <input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} className="mt-1 h-11 w-full border border-slate-300 bg-white px-3 text-sm outline-none focus:border-slate-950" />
              </label>
              <button type="submit" disabled={!title.trim() || favoriteUniversities.length === 0} className="mt-auto inline-flex min-h-11 items-center justify-center gap-2 bg-slate-950 px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"><Plus className="h-4 w-4" /> Добавить</button>
            </div>
          </form>

          {visibleTasks.length > 0 ? <ul className="mt-3">{visibleTasks.map((task) => <TaskRow key={task.id} task={task} profileId={profile.id} onChange={setPlanner} />)}</ul> : <p className="mt-6 border-l-2 border-slate-300 pl-4 text-sm leading-6 text-slate-600">Добавьте университет в избранное — его рекомендации по research, волонтёрству, стажировкам, проектам или олимпиадам станут задачами чеклиста.</p>}
        </section>

        <section aria-labelledby="calendar-title">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Сроки и напоминания</p>
          <h2 id="calendar-title" className="mt-1 font-brand text-2xl font-semibold text-slate-950">Календарь</h2>
          <div className="mt-5 border border-slate-300 bg-white p-3 sm:p-4">
            <div className="flex items-center justify-between gap-3">
              <button type="button" aria-label="Предыдущий месяц" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} className="grid h-11 w-11 place-items-center"><ChevronLeft className="h-5 w-5" /></button>
              <h3 className="text-sm font-semibold capitalize text-slate-950">{month.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}</h3>
              <button type="button" aria-label="Следующий месяц" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} className="grid h-11 w-11 place-items-center"><ChevronRight className="h-5 w-5" /></button>
            </div>
            <div className="grid grid-cols-7 border-t border-slate-200 text-center text-[10px] font-semibold uppercase text-slate-400 sm:text-xs">{weekdayLabels.map((day) => <div key={day} className="py-2">{day}</div>)}</div>
            <div className="grid grid-cols-7 border-l border-t border-slate-200">
              {monthCells(month).map((date, index) => {
                if (!date) return <div key={`empty-${index}`} className="min-h-14 border-b border-r border-slate-200 bg-slate-50" />;
                const key = dateKey(date);
                const count = tasksByDate.get(key) ?? 0;
                return <button key={key} type="button" onClick={() => setSelectedDate(key)} className={`relative min-h-14 border-b border-r border-slate-200 p-1 text-left text-xs ${selectedDate === key ? 'bg-slate-950 text-white' : 'bg-white text-slate-700 hover:bg-slate-50'}`}><span>{date.getDate()}</span>{count > 0 && <span className={`absolute bottom-1 right-1 grid h-5 min-w-5 place-items-center rounded-full px-1 text-[10px] font-bold ${selectedDate === key ? 'bg-white text-slate-950' : 'bg-slate-950 text-white'}`}>{count}</span>}</button>;
              })}
            </div>
          </div>
          <div className="mt-5 border-t border-slate-300 pt-4">
            <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-slate-500" /><h3 className="text-sm font-semibold text-slate-950">{new Date(`${selectedDate}T00:00:00`).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</h3></div>
            {selectedDateTasks.length > 0 ? <ul className="mt-3 space-y-3">{selectedDateTasks.map((task) => <li key={task.id} className="border-l-2 border-slate-300 pl-3"><p className="text-sm font-semibold text-slate-950">{task.title}</p><p className="mt-1 text-xs text-slate-500">{task.university_name}</p></li>)}</ul> : <p className="mt-3 text-sm text-slate-500">На эту дату задач нет.</p>}
          </div>
        </section>
      </div>
    </main>
  );
};
