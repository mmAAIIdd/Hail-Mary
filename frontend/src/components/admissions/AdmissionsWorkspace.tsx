import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowUpRight,
  CalendarDays,
  Check,
  GitCompareArrows,
  LoaderCircle,
  RefreshCw,
  School,
} from 'lucide-react';
import { UserProfile } from '../../types/profile';
import { AdmissionsPlan, UniversityRecommendation } from '../../types/admissions';
import {
  AdmissionsApiError,
  generateAdmissionsPlan,
  recommendationsAvailable,
} from '../../lib/admissionsApi';
import { loadAdmissionsPlan, saveAdmissionsPlan } from '../../lib/admissionsStorage';

interface AdmissionsWorkspaceProps {
  profile: UserProfile;
}

type WorkspaceTab = 'universities' | 'comparison' | 'roadmap';

const fitLabels = {
  ambitious: 'Амбициозный',
  balanced: 'Основной',
  safer: 'Более реалистичный',
} as const;

const fitStyles = {
  ambitious: 'border-amber-200 bg-amber-50 text-amber-800',
  balanced: 'border-blue-200 bg-blue-50 text-blue-800',
  safer: 'border-emerald-200 bg-emerald-50 text-emerald-800',
} as const;

const money = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

function annualCost(university: UniversityRecommendation): string {
  return `${money.format(university.annual_cost.min_usd)}–${money.format(university.annual_cost.max_usd)}`;
}

function UniversityCard({
  university,
  selected,
  onToggle,
}: {
  university: UniversityRecommendation;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <article className="flex h-full flex-col border border-slate-200 bg-white p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className={`border px-2.5 py-1 text-[11px] font-semibold ${fitStyles[university.fit_level]}`}>
              {fitLabels[university.fit_level]}
            </span>
            <span className="text-xs font-medium text-slate-500">
              {university.fit_score}/100 по анкете
            </span>
          </div>
          <h3 className="text-lg font-bold leading-snug text-slate-950">{university.name}</h3>
          <p className="mt-1 text-sm text-slate-500">{university.city}, {university.country}</p>
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-slate-950 text-white">
          <School className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-5 h-1.5 overflow-hidden bg-slate-100" aria-hidden="true">
        <div className="h-full bg-slate-950" style={{ width: `${university.fit_score}%` }} />
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-4 border-y border-slate-100 py-4 text-sm">
        <div>
          <dt className="text-xs text-slate-500">Программа</dt>
          <dd className="mt-1 font-semibold leading-5 text-slate-900">{university.program_name}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Расходы в год</dt>
          <dd className="mt-1 font-semibold leading-5 text-slate-900">{annualCost(university)}</dd>
        </div>
      </dl>

      <div className="mt-5 flex-1 space-y-5">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">Почему подходит</h4>
          <ul className="mt-3 space-y-2.5">
            {university.why_fit.map((reason) => (
              <li key={reason} className="flex gap-2.5 text-sm leading-6 text-slate-700">
                <Check className="mt-1 h-4 w-4 shrink-0 text-emerald-700" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-l-2 border-amber-300 pl-3">
          <h4 className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">Что проверить</h4>
          <p className="mt-2 text-sm leading-6 text-slate-700">{university.concerns.join(' ')}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row">
        <button
          type="button"
          onClick={onToggle}
          className={selected
            ? 'min-h-11 flex-1 border border-slate-950 bg-slate-950 px-4 text-sm font-semibold text-white'
            : 'min-h-11 flex-1 border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 transition hover:border-slate-950'}
        >
          {selected ? 'Добавлен к сравнению' : 'Добавить к сравнению'}
        </button>
        <a
          href={university.official_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center justify-center gap-1.5 px-3 text-sm font-semibold text-slate-700 hover:text-black"
        >
          Сайт <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    </article>
  );
}

function ComparisonTable({ universities }: { universities: UniversityRecommendation[] }) {
  if (universities.length < 2) {
    return (
      <div className="border border-slate-200 bg-white p-6 text-sm leading-6 text-slate-600">
        Выберите минимум два университета на вкладке «Университеты».
      </div>
    );
  }

  const rows = [
    { label: 'Соответствие', value: (university: UniversityRecommendation) => `${university.fit_score}/100 · ${fitLabels[university.fit_level]}` },
    { label: 'Программа', value: (university: UniversityRecommendation) => university.program_name },
    { label: 'Расходы в год', value: annualCost },
    { label: 'Стипендии', value: (university: UniversityRecommendation) => university.scholarships.join('; ') || 'Не найдены' },
    { label: 'Foundation', value: (university: UniversityRecommendation) => university.foundation_note },
    { label: 'Работа во время учёбы', value: (university: UniversityRecommendation) => university.work_rules_note },
    { label: 'Сроки', value: (university: UniversityRecommendation) => university.deadline_note },
    { label: 'Главный риск', value: (university: UniversityRecommendation) => university.concerns[0] },
  ];

  return (
    <div className="overflow-x-auto border border-slate-200 bg-white">
      <table className="min-w-[760px] w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="w-44 px-4 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Критерий</th>
            {universities.map((university) => (
              <th key={university.id} className="min-w-60 px-4 py-4 align-top">
                <span className="block font-bold text-slate-950">{university.name}</span>
                <span className="mt-1 block text-xs font-normal text-slate-500">{university.country}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-slate-100 last:border-0">
              <th className="px-4 py-4 align-top font-semibold text-slate-700">{row.label}</th>
              {universities.map((university) => (
                <td key={university.id} className="px-4 py-4 align-top leading-6 text-slate-700">
                  {row.value(university)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Roadmap({ plan }: { plan: AdmissionsPlan }) {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="space-y-0 border border-slate-200 bg-white">
        {plan.roadmap.map((stage, index) => (
          <section key={stage.id} className="grid gap-4 border-b border-slate-200 p-5 last:border-0 sm:grid-cols-[150px_1fr] sm:p-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">Этап {index + 1}</span>
              <p className="mt-2 text-sm font-semibold text-slate-900">{stage.period}</p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-950">{stage.title}</h3>
              <ol className="mt-4 space-y-4">
                {stage.tasks.map((task, taskIndex) => (
                  <li key={`${stage.id}-${taskIndex}`} className="grid grid-cols-[28px_1fr] gap-3">
                    <span className="flex h-7 w-7 items-center justify-center border border-slate-300 text-xs font-bold text-slate-700">
                      {taskIndex + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-slate-900">{task.title}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{task.reason}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        ))}
      </div>

      <aside className="h-fit bg-slate-950 p-5 text-white sm:p-6">
        <h3 className="text-base font-bold">Ближайшие действия</h3>
        <ol className="mt-5 space-y-4">
          {plan.next_actions.map((action, index) => (
            <li key={action} className="flex gap-3 text-sm leading-6 text-slate-200">
              <span className="font-bold text-white">{String(index + 1).padStart(2, '0')}</span>
              <span>{action}</span>
            </li>
          ))}
        </ol>
      </aside>
    </div>
  );
}

export const AdmissionsWorkspace: React.FC<AdmissionsWorkspaceProps> = ({ profile }) => {
  const [plan, setPlan] = useState<AdmissionsPlan | null>(() => loadAdmissionsPlan(profile));
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('universities');
  const [selectedIds, setSelectedIds] = useState<string[]>(() => plan?.universities.slice(0, 2).map((item) => item.id) || []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  const comparedUniversities = useMemo(
    () => plan?.universities.filter((university) => selectedIds.includes(university.id)) || [],
    [plan, selectedIds],
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
      setSelectedIds(nextPlan.universities.slice(0, 2).map((item) => item.id));
      saveAdmissionsPlan(profile, nextPlan);
      setActiveTab('universities');
    } catch (requestError) {
      if (requestError instanceof DOMException && requestError.name === 'AbortError') return;
      setError(requestError instanceof AdmissionsApiError
        ? requestError.message
        : 'Не удалось построить рекомендации.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleComparison = (universityId: string) => {
    setSelectedIds((current) => {
      if (current.includes(universityId)) return current.filter((id) => id !== universityId);
      if (current.length >= 3) {
        setError('Для сравнения можно выбрать до трёх университетов.');
        return current;
      }
      setError('');
      return [...current, universityId];
    });
  };

  if (!plan) {
    const available = recommendationsAvailable();
    return (
      <section className="border border-slate-200 bg-[#f5f1ea] p-5 sm:p-8">
        <div className="grid items-end gap-8 lg:grid-cols-[1fr_340px]">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Следующий шаг</span>
            <h2 className="mt-3 max-w-2xl font-brand text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl">
              Университеты и путь поступления
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-700">
              Получите шесть вариантов по странам, бюджету и интересам. Затем сравните их и соберите порядок действий до подачи.
            </p>
            <ul className="mt-6 grid gap-3 text-sm text-slate-700 sm:grid-cols-3">
              <li className="border-t border-slate-300 pt-3">Проверка по открытым источникам</li>
              <li className="border-t border-slate-300 pt-3">Сравнение до трёх вариантов</li>
              <li className="border-t border-slate-300 pt-3">План по вашим срокам</li>
            </ul>
          </div>
          <div className="border border-slate-300 bg-white p-5">
            <p className="text-sm leading-6 text-slate-600">
              Обычно подбор занимает до минуты. Имя и фамилия не отправляются в сервис рекомендаций.
            </p>
            <button
              type="button"
              onClick={requestPlan}
              disabled={isLoading || !available}
              className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <School className="h-4 w-4" />}
              {isLoading ? 'Подбираем варианты…' : 'Подобрать университеты'}
            </button>
            {!available && (
              <p className="mt-3 text-xs leading-5 text-amber-800">Сервис рекомендаций готовится к подключению.</p>
            )}
            {error && <p className="mt-3 text-sm leading-5 text-rose-700">{error}</p>}
          </div>
        </div>
      </section>
    );
  }

  const tabs: Array<{ id: WorkspaceTab; label: string; shortLabel: string; icon: React.ReactNode }> = [
    { id: 'universities', label: 'Университеты', shortLabel: 'Вузы', icon: <School className="h-4 w-4" /> },
    { id: 'comparison', label: `Сравнение (${selectedIds.length})`, shortLabel: `Сравнить (${selectedIds.length})`, icon: <GitCompareArrows className="h-4 w-4" /> },
    { id: 'roadmap', label: 'Путь поступления', shortLabel: 'Путь', icon: <CalendarDays className="h-4 w-4" /> },
  ];

  return (
    <section className="space-y-6 border-t-4 border-slate-950 pt-6">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Персональный подбор</span>
          <h2 className="mt-2 font-brand text-3xl font-semibold text-slate-950 sm:text-4xl">Ваши варианты</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{plan.strategy_summary}</p>
        </div>
        <button
          type="button"
          onClick={requestPlan}
          disabled={isLoading}
          className="inline-flex min-h-11 items-center justify-center gap-2 border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-950 disabled:opacity-60"
        >
          {isLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Обновить подбор
        </button>
      </div>

      {error && <div className="border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</div>}

      <div className="grid grid-cols-3 border-b border-slate-200" role="tablist" aria-label="Разделы рекомендаций">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={activeTab === tab.id
              ? 'inline-flex min-h-12 items-center justify-center gap-1.5 border-b-2 border-slate-950 px-2 text-xs font-bold text-slate-950 sm:gap-2 sm:px-4 sm:text-sm'
              : 'inline-flex min-h-12 items-center justify-center gap-1.5 border-b-2 border-transparent px-2 text-xs font-semibold text-slate-500 hover:text-slate-900 sm:gap-2 sm:px-4 sm:text-sm'}
          >
            {tab.icon}
            <span className="sm:hidden">{tab.shortLabel}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {activeTab === 'universities' && (
        <div className="grid gap-4 lg:grid-cols-2">
          {plan.universities.map((university) => (
            <UniversityCard
              key={university.id}
              university={university}
              selected={selectedIds.includes(university.id)}
              onToggle={() => toggleComparison(university.id)}
            />
          ))}
        </div>
      )}

      {activeTab === 'comparison' && <ComparisonTable universities={comparedUniversities} />}
      {activeTab === 'roadmap' && <Roadmap plan={plan} />}

      <footer className="border-t border-slate-200 pt-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <p className="max-w-2xl text-xs leading-5 text-slate-500">{plan.disclaimer}</p>
          <details className="shrink-0 text-sm">
            <summary className="cursor-pointer font-semibold text-slate-700">Источники ({plan.sources.length})</summary>
            <div className="mt-3 max-h-60 w-full space-y-2 overflow-y-auto sm:w-80">
              {plan.sources.map((source) => (
                <a
                  key={source.url}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2 text-xs leading-5 text-slate-600 hover:text-black"
                >
                  <span>{source.title}</span><ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                </a>
              ))}
            </div>
          </details>
        </div>
      </footer>
    </section>
  );
};
