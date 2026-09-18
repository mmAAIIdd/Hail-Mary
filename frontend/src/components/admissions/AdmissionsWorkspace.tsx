import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowUpRight,
  BookOpenCheck,
  CalendarClock,
  CheckCircle2,
  CircleAlert,
  FileCheck2,
  GraduationCap,
  LoaderCircle,
  RefreshCw,
  Route,
  Target,
} from 'lucide-react';
import { UserProfile } from '../../types/profile';
import { AdmissionsPlan, RoadmapStage, UniversityRecommendation } from '../../types/admissions';
import { AdmissionsApiError, generateAdmissionsPlan, recommendationsAvailable } from '../../lib/admissionsApi';
import { loadAdmissionsPlan, saveAdmissionsPlan } from '../../lib/admissionsStorage';

interface AdmissionsWorkspaceProps {
  profile: UserProfile;
}

const fitLabels = {
  ambitious: 'Амбициозный',
  balanced: 'Целевой',
  safer: 'Более реалистичный',
} as const;

const fitStyles = {
  ambitious: 'bg-amber-50 text-amber-800 ring-amber-200',
  balanced: 'bg-blue-50 text-blue-700 ring-blue-200',
  safer: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
} as const;

const confidenceLabels = {
  low: 'данных мало',
  medium: 'средняя точность',
  high: 'данных достаточно',
} as const;

const categoryLabels: Record<RoadmapStage['tasks'][number]['category'], string> = {
  deadlines: 'Дедлайны',
  academics: 'Академический план',
  activities: 'Активности',
  exams: 'Экзамены',
  grades: 'Успеваемость',
  olympiads: 'Олимпиады',
  portfolio: 'Проекты и портфолио',
  personality: 'Личный профиль',
  documents: 'Документы',
  finance: 'Финансы',
};

const money = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

function annualCost(university: UniversityRecommendation): string {
  return `${money.format(university.annual_cost.min_usd)}–${money.format(university.annual_cost.max_usd)}`;
}

function ChanceRing({ percent, compact = false }: { percent: number; compact?: boolean }) {
  const safePercent = Math.min(99, Math.max(1, percent));
  return (
    <div
      className={`relative grid shrink-0 place-items-center rounded-full ${compact ? 'h-16 w-16' : 'h-28 w-28'}`}
      style={{ background: `conic-gradient(#0f172a ${safePercent}%, #e2e8f0 0)` }}
      aria-label={`Ориентировочный шанс поступления ${safePercent}%`}
    >
      <div className={`grid place-items-center rounded-full bg-white ${compact ? 'h-[52px] w-[52px]' : 'h-[88px] w-[88px]'}`}>
        <span className={`font-brand font-semibold text-slate-950 ${compact ? 'text-lg' : 'text-3xl'}`}>{safePercent}%</span>
      </div>
    </div>
  );
}

function UniversityListItem({
  university,
  active,
  onSelect,
}: {
  university: UniversityRecommendation;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 transition ${
        active
          ? 'border-slate-500 bg-slate-50 shadow-sm ring-1 ring-slate-300'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
      }`}
    >
      <button type="button" onClick={onSelect} className="flex w-full items-center gap-4 text-left">
        <ChanceRing percent={university.admission_chance.percent} compact />
        <div className="min-w-0 flex-1">
          <span className={`inline-flex rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wide ring-1 ${fitStyles[university.fit_level]}`}>
            {fitLabels[university.fit_level]}
          </span>
          <h3 className="mt-2 truncate text-sm font-bold text-slate-950">{university.name}</h3>
          <p className="mt-1 truncate text-xs text-slate-500">{university.city}, {university.country}</p>
        </div>
      </button>
      <div className="mt-3 flex items-center justify-between border-t border-slate-200/80 pt-3">
        <button type="button" onClick={onSelect} className="text-xs font-semibold text-slate-600 hover:text-slate-950">
          Открыть разбор
        </button>
        <a href={university.official_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-slate-800 hover:text-black">
          Официальный сайт <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}

function UniversityAnalysis({ university }: { university: UniversityRecommendation }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="grid gap-6 border-b border-slate-100 p-5 sm:p-7 lg:grid-cols-[1fr_auto] lg:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ${fitStyles[university.fit_level]}`}>
              {fitLabels[university.fit_level]}
            </span>
            <span className="text-xs font-medium text-slate-500">Соответствие анкете {university.fit_score}/100 · не шанс поступления</span>
          </div>
          <h2 className="mt-4 font-brand text-2xl font-semibold text-slate-950 sm:text-3xl">{university.name}</h2>
          <p className="mt-1 text-sm text-slate-500">{university.program_name} · {university.city}, {university.country}</p>
          <a
            href={university.official_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Официальный сайт <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
        <div className="flex items-center gap-4 lg:flex-col lg:text-center">
          <ChanceRing percent={university.admission_chance.percent} />
          <div>
            <p className="text-sm font-bold text-slate-900">Ориентир по анкете</p>
            <p className="mt-1 text-xs text-slate-500">{confidenceLabels[university.admission_chance.confidence]} · не статистика</p>
          </div>
        </div>
      </div>

      <div className="space-y-7 p-5 sm:p-7">
        <section className="rounded-2xl bg-slate-950 p-5 text-white">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-300">
            <Target className="h-4 w-4" /> Разбор рекомендации
          </div>
          <p className="mt-3 text-sm leading-7 text-slate-200">{university.admission_chance.explanation}</p>
        </section>

        <section>
          <h3 className="text-sm font-bold text-slate-950">Что формирует оценку</h3>
          <div className="mt-4 space-y-4">
            {university.admission_chance.factors.map((factor) => (
              <div key={factor.label}>
                <div className="mb-1.5 flex items-center justify-between gap-4 text-xs">
                  <span className="font-semibold text-slate-800">{factor.label}</span>
                  <span className="font-bold text-slate-800">{factor.score}/100</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-slate-800" style={{ width: `${factor.score}%` }} />
                </div>
                <p className="mt-1.5 text-xs leading-5 text-slate-500">{factor.note}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid gap-5 sm:grid-cols-2">
          <section className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
            <h3 className="flex items-center gap-2 text-sm font-bold text-emerald-900"><CheckCircle2 className="h-4 w-4" /> Почему подходит</h3>
            <ul className="mt-3 space-y-2">
              {university.why_fit.map((reason) => <li key={reason} className="text-sm leading-6 text-emerald-950">• {reason}</li>)}
            </ul>
          </section>
          <section className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
            <h3 className="flex items-center gap-2 text-sm font-bold text-amber-900"><CircleAlert className="h-4 w-4" /> Риски и пробелы</h3>
            <ul className="mt-3 space-y-2">
              {university.concerns.map((concern) => <li key={concern} className="text-sm leading-6 text-amber-950">• {concern}</li>)}
            </ul>
          </section>
        </div>

        <dl className="grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-2">
          {[
            ['Расходы в год', `${annualCost(university)}. ${university.annual_cost.note}`],
            ['Foundation', university.foundation_note],
            ['Работа во время учёбы', university.work_rules_note],
            ['Стипендии', university.scholarships.join('; ') || 'Подходящие варианты не подтверждены'],
          ].map(([label, value]) => (
            <div key={label} className="bg-white p-4">
              <dt className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</dt>
              <dd className="mt-2 text-sm leading-6 text-slate-700">{value}</dd>
            </div>
          ))}
        </dl>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Дедлайн подачи</p>
          <p className="mt-2 text-sm leading-6 text-slate-800">{university.deadline_note}</p>
          {university.deadline_source_url ? (
            <a href={university.deadline_source_url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-slate-900 underline underline-offset-2">Официальный источник срока <ArrowUpRight className="h-3.5 w-3.5" /></a>
          ) : <p className="mt-2 text-xs font-semibold text-amber-800">Источник срока не подтверждён — уточните на официальном сайте.</p>}
        </div>
      </div>
    </article>
  );
}

function Roadmap({ plan }: { plan: AdmissionsPlan }) {
  return (
    <section className="mt-14" aria-labelledby="roadmap-title">
      <div className="grid gap-5 border-b border-slate-200 pb-6 lg:grid-cols-[1fr_360px] lg:items-end">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Подробный roadmap</span>
          <h2 id="roadmap-title" className="mt-2 font-brand text-3xl font-semibold text-slate-950 sm:text-4xl">От сегодняшнего дня до подачи</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">Каждый шаг содержит срок, причину и понятный результат, который можно проверить.</p>
        </div>
        <aside className="rounded-2xl bg-slate-100 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-700">Ближайшие действия</p>
          <ol className="mt-3 space-y-2">
            {plan.next_actions.map((action, index) => (
              <li key={action} className="flex gap-2 text-sm leading-5 text-slate-800"><span className="font-bold text-slate-950">{index + 1}.</span>{action}</li>
            ))}
          </ol>
        </aside>
      </div>

      <div className="relative mt-8 space-y-5 before:absolute before:bottom-8 before:left-[23px] before:top-8 before:w-px before:bg-slate-300 sm:before:left-[31px]">
        {plan.roadmap.map((stage, index) => (
          <article key={stage.id} className="relative grid gap-4 pl-14 sm:grid-cols-[190px_1fr] sm:gap-7 sm:pl-20">
            <span className="absolute left-0 top-0 grid h-12 w-12 place-items-center rounded-full border-4 border-white bg-slate-950 text-sm font-bold text-white shadow-sm sm:h-16 sm:w-16">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="pt-2">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-600">{stage.period}</p>
              <h3 className="mt-2 text-base font-bold text-slate-950">{stage.title}</h3>
            </div>
            <div className="grid gap-3 xl:grid-cols-2">
              {stage.tasks.map((task, taskIndex) => (
                <div key={`${stage.id}-${taskIndex}`} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-600">{categoryLabels[task.category]}</span>
                    <span className="flex items-center gap-1 text-xs font-semibold text-slate-700"><CalendarClock className="h-3.5 w-3.5" />{task.deadline}</span>
                  </div>
                  <h4 className="mt-3 text-sm font-bold text-slate-950">{task.title}</h4>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{task.reason}</p>
                  <p className="mt-3 border-t border-slate-100 pt-3 text-xs leading-5 text-slate-500"><strong className="text-slate-700">Результат:</strong> {task.result}</p>
                  {task.source_url ? (
                    <a href={task.source_url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-slate-700 underline underline-offset-2">Официальный источник <ArrowUpRight className="h-3.5 w-3.5" /></a>
                  ) : ['deadlines', 'exams', 'documents', 'finance'].includes(task.category) && (
                    <p className="mt-2 text-xs font-medium text-amber-800">Фактические требования уточните на официальном сайте.</p>
                  )}
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function EmptyState({ onGenerate, loading, error }: { onGenerate: () => void; loading: boolean; error: string }) {
  const available = recommendationsAvailable();
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="grid lg:grid-cols-[1.35fr_0.65fr]">
        <div className="p-6 sm:p-10">
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Полный персональный разбор</span>
          <h2 className="mt-3 max-w-2xl font-brand text-3xl font-semibold leading-tight text-slate-950 sm:text-5xl">Не просто список вузов, а стратегия поступления</h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">Сервис сопоставит анкету с шестью университетами, объяснит оценку шансов и соберёт подробный roadmap до подачи.</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              [Target, 'Шансы', 'Ориентир с факторами и уровнем уверенности'],
              [BookOpenCheck, 'Разбор', 'Аргументы, риски, бюджет и требования'],
              [Route, 'Roadmap', 'Сроки, экзамены, документы и активности'],
            ].map(([Icon, title, text]) => {
              const ItemIcon = Icon as typeof Target;
              return <div key={title as string} className="rounded-2xl bg-slate-50 p-4"><ItemIcon className="h-5 w-5 text-slate-700" /><h3 className="mt-3 text-sm font-bold text-slate-900">{title as string}</h3><p className="mt-1 text-xs leading-5 text-slate-500">{text as string}</p></div>;
            })}
          </div>
        </div>
        <div className="flex flex-col justify-center bg-slate-950 p-6 text-white sm:p-8">
          <GraduationCap className="h-9 w-9 text-slate-300" />
          <p className="mt-5 text-sm leading-6 text-slate-300">Обычно анализ занимает до минуты. Имя и фамилия не отправляются в сервис рекомендаций.</p>
          <button type="button" onClick={onGenerate} disabled={loading || !available} className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50">
            {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Target className="h-4 w-4" />}
            {loading ? 'Формируем разбор…' : 'Сформировать стратегию'}
          </button>
          {!available && <p className="mt-3 text-xs text-amber-300">Сервис рекомендаций ещё не подключён.</p>}
          {error && <p className="mt-3 text-sm text-rose-300">{error}</p>}
        </div>
      </div>
    </section>
  );
}

export const AdmissionsWorkspace: React.FC<AdmissionsWorkspaceProps> = ({ profile }) => {
  const [plan, setPlan] = useState<AdmissionsPlan | null>(() => loadAdmissionsPlan(profile));
  const [selectedId, setSelectedId] = useState(() => plan?.universities[0]?.id || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  const selectedUniversity = useMemo(
    () => plan?.universities.find((university) => university.id === selectedId) || plan?.universities[0],
    [plan, selectedId],
  );

  const requestPlan = async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setIsLoading(true);
    setError('');

    try {
      const nextPlan = await generateAdmissionsPlan(profile, controller.signal);
      setPlan(nextPlan);
      setSelectedId(nextPlan.universities[0]?.id || '');
      saveAdmissionsPlan(profile, nextPlan);
    } catch (requestError) {
      if (requestError instanceof DOMException && requestError.name === 'AbortError') return;
      setError(requestError instanceof AdmissionsApiError ? requestError.message : 'Не удалось сформировать стратегию.');
    } finally {
      if (abortRef.current === controller) setIsLoading(false);
    }
  };

  if (!plan) return <EmptyState onGenerate={requestPlan} loading={isLoading} error={error} />;

  return (
    <div>
      <section className="rounded-3xl border border-slate-200 bg-[#f5f1ea] p-5 sm:p-7">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
          <div className="max-w-4xl">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-600">Главная рекомендация</span>
            <p className="mt-3 font-brand text-xl font-semibold leading-8 text-slate-950 sm:text-2xl">{plan.strategy_summary}</p>
          </div>
          <button type="button" onClick={requestPlan} disabled={isLoading} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-700 hover:text-slate-950 disabled:opacity-60">
            {isLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />} Обновить разбор
          </button>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-2 sm:max-w-xl sm:gap-3">
          {(['ambitious', 'balanced', 'safer'] as const).map((level) => (
            <div key={level} className="rounded-2xl bg-white/80 p-3 text-center ring-1 ring-slate-200">
              <strong className="block text-2xl text-slate-950">{plan.universities.filter((item) => item.fit_level === level).length}</strong>
              <span className="mt-1 block text-[10px] font-bold uppercase tracking-wide text-slate-500">{fitLabels[level]}</span>
            </div>
          ))}
        </div>
      </section>

      {error && <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</div>}

      <section className="mt-8 grid gap-6 lg:grid-cols-[330px_minmax(0,1fr)] lg:items-start">
        <aside className="space-y-3 lg:sticky lg:top-5">
          <div className="mb-4 flex items-end justify-between">
            <div><span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Подходящие университеты</span><p className="mt-1 text-sm text-slate-600">Выберите вуз для полного разбора</p></div>
            <span className="rounded-full bg-slate-950 px-2.5 py-1 text-xs font-bold text-white">{plan.universities.length}</span>
          </div>
          {plan.universities.map((university) => <UniversityListItem key={university.id} university={university} active={selectedUniversity?.id === university.id} onSelect={() => setSelectedId(university.id)} />)}
        </aside>
        {selectedUniversity && <UniversityAnalysis university={selectedUniversity} />}
      </section>

      <Roadmap plan={plan} />

      <footer className="mt-12 rounded-3xl border border-slate-200 bg-white p-5 sm:p-7">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <div className="flex items-center gap-2"><FileCheck2 className="h-5 w-5 text-slate-700" /><h2 className="text-base font-bold text-slate-950">Источники и достоверность</h2></div>
            <p className="mt-3 text-sm leading-6 text-slate-600">{plan.disclaimer}</p>
            <p className="mt-3 text-xs font-semibold text-slate-500">{plan.research_mode === 'google_search' ? 'Поиск источников был включён: всё равно сверьте факты перед подачей.' : 'Онлайн-проверка недоступна: факты нужно сверить перед подачей.'}</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {plan.sources.map((source) => (
              <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer" className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 p-3 text-sm leading-5 text-slate-700 transition hover:border-slate-500 hover:text-slate-950">
                <span>{source.title}</span><ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0" />
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};
