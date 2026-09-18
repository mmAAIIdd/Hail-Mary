import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, Heart, LoaderCircle, RefreshCw } from 'lucide-react';
import { UserProfile } from '../../types/profile';
import { AdmissionsPlan, RoadmapStage, UniversityRecommendation } from '../../types/admissions';
import { AdmissionsApiError, generateAdmissionsPlan, recommendationsAvailable } from '../../lib/admissionsApi';
import { loadAdmissionsPlan, saveAdmissionsPlan } from '../../lib/admissionsStorage';
import { listAdmissionsHistory, loadHistoryPlan, saveHistoryPlan } from '../../lib/admissionsHistory';
import { getCampusImage } from '../../lib/campusImages';
import type { CampusImage } from '../../lib/campusImages';
import { loadPlannerState, toggleFavoriteUniversity } from '../../lib/plannerStorage';

interface AdmissionsWorkspaceProps {
  profile: UserProfile;
}

const fitLabels = {
  ambitious: 'Мечта',
  balanced: 'Реалистичная цель',
  safer: 'Резервный вариант',
} as const;

const categoryLabels: Record<RoadmapStage['tasks'][number]['category'], string> = {
  general: 'Подготовка',
  deadlines: 'Сроки',
  academics: 'Учёба',
  activities: 'Активности',
  exams: 'Экзамены',
  grades: 'Успеваемость',
  olympiads: 'Олимпиады',
  portfolio: 'Портфолио',
  personality: 'Личный профиль',
  documents: 'Документы',
  finance: 'Финансы',
};

function SourceLink({ href, children }: { href: string; children: React.ReactNode }) {
  if (!href) return null;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-slate-800 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900">
      {children} <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
    </a>
  );
}

function Chance({ university, large = false }: { university: UniversityRecommendation; large?: boolean }) {
  const chance = university.admission_chance;
  if (!chance) return <span className="text-xs text-slate-500">Недостаточно данных для оценки</span>;
  return (
    <div className="flex items-center gap-2" aria-label={`Ориентировочная, не статистическая оценка поступления: ${chance.percent}%`}>
      <span
        className={`grid shrink-0 place-items-center rounded-full ${large ? 'h-20 w-20 p-[6px]' : 'h-11 w-11 p-[4px]'}`}
        style={{ background: `conic-gradient(#0f172a ${chance.percent}%, #e2e8f0 0)` }}
        aria-hidden="true"
      >
        <span className={`grid h-full w-full place-items-center rounded-full bg-white font-semibold text-slate-950 ${large ? 'text-xl' : 'text-xs'}`}>
          {chance.percent}%
        </span>
      </span>
      {large && <span className="max-w-36 text-xs leading-5 text-slate-500">{chance.confidence === 'low' ? 'Ориентир низкой точности, не статистическая вероятность' : 'Ориентир модели, не гарантия поступления'}</span>}
    </div>
  );
}

function CampusPhoto({ universityName }: { universityName: string }) {
  const [image, setImage] = useState<CampusImage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setImage(null);
    void getCampusImage(universityName).then((result) => {
      if (active) {
        setImage(result);
        setIsLoading(false);
      }
    });
    return () => { active = false; };
  }, [universityName]);

  if (isLoading) return <div className="mt-7 grid min-h-48 place-items-center bg-slate-100 text-sm text-slate-500"><LoaderCircle className="mr-2 inline h-4 w-4 animate-spin" /> Ищем подтверждённое фото</div>;
  if (!image) return <p className="mt-7 border-y border-slate-200 py-4 text-sm leading-6 text-slate-600">Подтверждённое изображение этого университета в Wikidata и Wikimedia Commons не найдено. Случайное фото не показываем.</p>;

  return (
    <figure className="mt-7">
      <img src={image.url} alt={`${universityName}: ${image.caption}`} loading="lazy" referrerPolicy="no-referrer" className="aspect-[16/9] w-full bg-slate-100 object-cover" />
      <figcaption className="mt-2 text-xs leading-5 text-slate-500">
        {image.caption}. Автор: {image.author}. {image.license}.{' '}
        <a href={image.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Источник и лицензия</a>
      </figcaption>
    </figure>
  );
}

function UniversityDetail({ university, plan, expanded, isFavorite, onToggleFavorite }: { university: UniversityRecommendation; plan: AdmissionsPlan; expanded: boolean; isFavorite: boolean; onToggleFavorite: () => void }) {
  const relatedSources = plan.sources.filter((source) => {
    try {
      const site = new URL(university.official_url).hostname;
      const sourceHost = new URL(source.url).hostname;
      return sourceHost === site || sourceHost.endsWith(`.${site}`) || site.endsWith(`.${sourceHost}`);
    } catch {
      return false;
    }
  });

  return (
    <article id="university-detail" className="min-w-0 border-t border-slate-300 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
      <div className="flex flex-col items-start justify-between gap-5 sm:flex-row">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Категория: {fitLabels[university.fit_level]} · {university.country}</p>
          <h3 className="mt-2 font-brand text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl">{university.name}</h3>
          <p className="mt-2 text-sm text-slate-600">{university.program_name} · {university.city}</p>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
            {university.official_url ? <SourceLink href={university.official_url}>{plan.research_mode === 'google_search' ? 'Сайт университета' : 'Указанный сайт — проверьте адрес'}</SourceLink> : <span className="text-sm text-amber-800">Ссылка на университет не подтверждена</span>}
            <button type="button" onClick={onToggleFavorite} className={`inline-flex min-h-11 items-center gap-2 text-sm font-semibold ${isFavorite ? 'text-rose-700' : 'text-slate-700 hover:text-slate-950'}`}><Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} aria-hidden="true" />{isFavorite ? 'В моих университетах' : 'Сохранить университет'}</button>
          </div>
        </div>
        <Chance university={university} large />
      </div>

      <div className="mt-8 border-t border-slate-200 pt-6">
        <h4 className="text-sm font-bold text-slate-950">Почему этот вариант в подборке</h4>
        <p className="mt-3 text-sm leading-7 text-slate-700">{university.why_fit.join(' ')} {university.admission_chance?.explanation}</p>
      </div>

      <div className="mt-6 grid gap-4 border-y border-slate-200 py-5 sm:grid-cols-[180px_minmax(0,1fr)]">
        <div><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Acceptance rate</p><p className="mt-2 text-2xl font-semibold text-slate-950">{university.acceptance_rate.percent !== null ? `${university.acceptance_rate.percent}%` : 'Не опубликован'}</p></div>
        <div><p className="text-sm leading-6 text-slate-600">{university.acceptance_rate.note}</p>{university.acceptance_rate.source_url && <p className="mt-2"><SourceLink href={university.acceptance_rate.source_url}>{university.acceptance_rate.scope === 'program' ? 'Источник по программе' : 'Источник по университету'}</SourceLink></p>}<p className="mt-2 text-xs leading-5 text-slate-500">Общий acceptance rate не является вашим персональным шансом и может не отражать конкурс на выбранный факультет.</p></div>
      </div>

      <CampusPhoto universityName={university.name} />

      {expanded && <>
        <div className="mt-7 space-y-6 border-t border-slate-200 pt-6">
          <div><h4 className="text-sm font-bold text-slate-950">Учебное соответствие</h4><p className="mt-2 text-sm leading-7 text-slate-700">{university.details.academic_fit || 'Для точного разбора нужны оценки по профильным предметам и требования выбранной программы.'}</p></div>
          <div><h4 className="text-sm font-bold text-slate-950">Почему стоит рассмотреть</h4><p className="mt-2 text-sm leading-7 text-slate-700">{university.details.choice_reason || university.why_fit.join(' ')}</p></div>
          <div><h4 className="text-sm font-bold text-slate-950">Что проверить перед решением</h4><p className="mt-2 text-sm leading-7 text-slate-700">{university.details.open_questions || university.concerns.join(' ')}</p></div>
          <div><h4 className="text-sm font-bold text-slate-950">Первый шаг</h4><p className="mt-2 text-sm leading-7 text-slate-700">{university.details.first_step || 'Откройте страницу программы и выпишите актуальные требования и срок подачи.'}</p></div>
        </div>
        {university.details.extracurricular_strategy.length > 0 && (
          <section className="mt-8 border-t border-slate-300 pt-6" aria-labelledby={`activities-${university.id}`}>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Стратегия профиля</p>
            <h4 id={`activities-${university.id}`} className="mt-2 font-brand text-2xl font-semibold leading-tight text-slate-950">Что начать для поступления именно в {university.name}</h4>
            <p className="mt-3 text-sm leading-6 text-slate-600">Это персональные идеи для усиления заявки на программу, а не официальные обязательные требования университета.</p>
            <ol className="mt-5 divide-y divide-slate-200 border-y border-slate-200">
              {university.details.extracurricular_strategy.map((item, index) => (
                <li key={`${university.id}-activity-${index}`} className="py-5">
                  <div className="flex items-start gap-3">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-slate-950 text-xs font-semibold text-white">{index + 1}</span>
                    <div className="min-w-0">
                      <h5 className="text-sm font-semibold leading-6 text-slate-950">{item.activity}</h5>
                      <p className="mt-2 text-sm leading-7 text-slate-700">{item.why_for_program}</p>
                      <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                        <div><dt className="font-semibold text-slate-950">Первые 30 дней</dt><dd className="mt-1 leading-6 text-slate-600">{item.first_30_days}</dd></div>
                        <div><dt className="font-semibold text-slate-950">Что сохранить в портфолио</dt><dd className="mt-1 leading-6 text-slate-600">{item.evidence}</dd></div>
                      </dl>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}
        <section className="mt-8 border-t border-slate-300 pt-6" aria-labelledby={`competition-${university.id}`}>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Конкуренция и ваши шансы</p>
          <h4 id={`competition-${university.id}`} className="mt-2 font-brand text-2xl font-semibold text-slate-950">Детальный разбор по {university.program_name}</h4>
          <p className="mt-3 text-sm leading-7 text-slate-700">{university.competition_analysis.summary || university.admission_chance?.explanation}</p>
          <dl className="mt-5 divide-y divide-slate-200 border-y border-slate-200 text-sm">
            <div className="grid gap-2 py-4 sm:grid-cols-[170px_minmax(0,1fr)]"><dt className="font-semibold text-slate-950">Академическая позиция</dt><dd className="leading-6 text-slate-600">{university.competition_analysis.academic_position || 'Нужны точные оценки по профильным предметам.'}</dd></div>
            <div className="grid gap-2 py-4 sm:grid-cols-[170px_minmax(0,1fr)]"><dt className="font-semibold text-slate-950">Экзамены и язык</dt><dd className="leading-6 text-slate-600">{university.competition_analysis.exam_position || 'Нужно проверить требования программы и результаты диагностики.'}</dd></div>
            <div className="grid gap-2 py-4 sm:grid-cols-[170px_minmax(0,1fr)]"><dt className="font-semibold text-slate-950">Extracurriculars</dt><dd className="leading-6 text-slate-600">{university.competition_analysis.activity_position || 'Нужно подтвердить глубину и результат текущих активностей.'}</dd></div>
            <div className="grid gap-2 py-4 sm:grid-cols-[170px_minmax(0,1fr)]"><dt className="font-semibold text-slate-950">Чем выделиться</dt><dd className="leading-6 text-slate-600">{university.competition_analysis.main_differentiator || 'Связать интерес к программе с одним продолжительным проектом и измеримым вкладом.'}</dd></div>
          </dl>
          {university.competition_analysis.improvement_priorities.length > 0 && <div className="mt-5"><h5 className="text-sm font-semibold text-slate-950">Главные приоритеты улучшения</h5><ol className="mt-3 space-y-2 text-sm leading-6 text-slate-700">{university.competition_analysis.improvement_priorities.map((priority, index) => <li key={priority} className="flex gap-3"><span className="font-semibold text-slate-400">{String(index + 1).padStart(2, '0')}</span><span>{priority}</span></li>)}</ol></div>}
        </section>
      {university.admission_chance && university.admission_chance.factors.length > 0 && (
        <div className="mt-7">
          <h4 className="text-sm font-bold text-slate-950">Что влияет на ориентир</h4>
          <div className="mt-4 space-y-4">
            {university.admission_chance.factors.map((factor) => (
              <div key={factor.label}>
                <div className="flex justify-between gap-4 text-xs font-semibold text-slate-700"><span>{factor.label}</span><span>{factor.score}/100</span></div>
                <div className="mt-2 h-1.5 bg-slate-100"><div className="h-full bg-slate-800" style={{ width: `${factor.score}%` }} /></div>
                <p className="mt-1 text-xs leading-5 text-slate-500">{factor.note}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-7 border-t border-slate-200 pt-5">
        <h4 className="text-sm font-bold text-slate-950">Что ещё уточнить</h4>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
          {university.concerns.map((concern) => <li key={concern}>— {concern}</li>)}
        </ul>
      </div>

      <dl className="mt-7 divide-y divide-slate-200 border-y border-slate-200 text-sm">
        <div className="grid gap-2 py-3 sm:grid-cols-[160px_1fr]"><dt className="font-semibold text-slate-600">Стоимость</dt><dd>Не подтверждена страницей программы</dd></div>
        <div className="grid gap-2 py-3 sm:grid-cols-[160px_1fr]"><dt className="font-semibold text-slate-600">Срок подачи</dt><dd>{university.deadline_source_url ? university.deadline_note : 'Уточнить на сайте программы'}</dd></div>
        <div className="grid gap-2 py-3 sm:grid-cols-[160px_1fr]"><dt className="font-semibold text-slate-600">Стипендия</dt><dd>Условия не подтверждены страницей программы</dd></div>
      </dl>
      {university.deadline_source_url && <p className="mt-3"><SourceLink href={university.deadline_source_url}>Источник срока подачи</SourceLink></p>}
      {university.scholarships.length > 0 && <div className="mt-6 border-t border-slate-200 pt-5"><h4 className="text-sm font-bold text-slate-950">Стипендии для проверки</h4><ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">{university.scholarships.map((scholarship) => <li key={scholarship}>— {scholarship}</li>)}</ul></div>}
      {relatedSources.length > 0 && (
        <div className="mt-5">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Ссылки по университету</p>
          <ul className="mt-2 space-y-1">{relatedSources.map((source) => <li key={source.url}><SourceLink href={source.url}>{source.title}</SourceLink></li>)}</ul>
        </div>
      )}
      </>}
    </article>
  );
}

function Comparison({ plan }: { plan: AdmissionsPlan }) {
  const rows = [
    { title: 'Страна', value: (university: UniversityRecommendation) => university.country },
    { title: 'Программа', value: (university: UniversityRecommendation) => university.program_name },
    { title: 'Категория', value: (university: UniversityRecommendation) => fitLabels[university.fit_level] },
    { title: 'Соответствие анкете', value: (university: UniversityRecommendation) => `${university.fit_score}/100` },
    { title: 'Ориентир поступления', value: (university: UniversityRecommendation) => university.admission_chance ? `${university.admission_chance.percent}% · низкая точность` : 'Нет оценки' },
    { title: 'Acceptance rate', value: (university: UniversityRecommendation) => university.acceptance_rate.percent !== null ? `${university.acceptance_rate.percent}% · ${university.acceptance_rate.scope === 'program' ? 'программа' : 'университет'}` : 'Официально не найден' },
    { title: 'Подача', value: (university: UniversityRecommendation) => university.deadline_source_url ? university.deadline_note : 'Срок не подтверждён' },
  ];
  return (
    <section className="mt-14" id="comparison" aria-labelledby="comparison-title">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Сравнение</p>
      <h2 id="comparison-title" className="mt-2 font-brand text-3xl font-semibold text-slate-950">Все варианты рядом</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">На телефоне варианты показаны отдельными блоками, на большом экране — общей таблицей. Балл соответствия не равен шансу поступления.</p>
      <div className="mt-5 grid gap-5 sm:hidden">
        {plan.universities.map((university) => (
          <article key={university.id} className="border-y border-slate-300 py-5">
            <h3 className="text-base font-semibold leading-6 text-slate-950">{university.name}</h3>
            <p className="mt-1 text-sm text-slate-600">{university.program_name} · {university.country}</p>
            <dl className="mt-4 divide-y divide-slate-200 text-sm">
              {rows.slice(2).map((row) => <div key={row.title} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-3 py-3"><dt className="font-semibold text-slate-600">{row.title}</dt><dd className="text-right leading-5 text-slate-800">{row.value(university)}</dd></div>)}
            </dl>
          </article>
        ))}
      </div>
      <div className="comparison-table mt-5 hidden overflow-x-auto border-y border-slate-300 sm:block">
        <table className="min-w-[920px] w-full border-collapse text-left text-sm">
          <thead><tr><th scope="col" className="w-40 p-3 text-xs font-bold uppercase text-slate-500">Критерий</th>{plan.universities.map((university) => <th scope="col" key={university.id} className="min-w-36 p-3 align-top font-semibold text-slate-950">{university.name}</th>)}</tr></thead>
          <tbody>{rows.map((row) => <tr key={row.title} className="border-t border-slate-200"><th scope="row" className="p-3 align-top font-semibold text-slate-600">{row.title}</th>{plan.universities.map((university) => <td key={university.id} className="p-3 align-top leading-5 text-slate-700">{row.value(university)}</td>)}</tr>)}</tbody>
        </table>
      </div>
    </section>
  );
}

function Roadmap({ plan }: { plan: AdmissionsPlan }) {
  const priorityLabels = { now: 'Начать сейчас', next: 'Следующий этап', later: 'Позже' } as const;
  const taskCount = plan.roadmap.reduce((total, stage) => total + stage.tasks.length, 0);

  return (
    <section className="mt-10 sm:mt-14" id="roadmap" aria-labelledby="roadmap-title">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">План подготовки</p>
      <h2 id="roadmap-title" className="mt-2 font-brand text-2xl font-semibold leading-tight text-slate-950 sm:text-3xl">Путь к поступлению в {plan.roadmap_target_university}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:leading-7">Пять последовательных этапов и {taskCount} конкретных действий. Активности, проекты и олимпиады подобраны для усиления заявки именно в целевой университет. Фактические требования и дедлайны проверяйте на официальной странице программы.</p>

      <ol className="relative mt-7 before:absolute before:bottom-4 before:left-[13px] before:top-4 before:w-px before:bg-slate-300 sm:mt-8 sm:before:left-[23px]">
        {plan.roadmap.map((stage, index) => (
          <li key={stage.id} className="relative grid grid-cols-[28px_minmax(0,1fr)] gap-2.5 pb-10 last:pb-0 sm:grid-cols-[48px_minmax(0,1fr)] sm:gap-6 sm:pb-12">
            <div className="relative z-10 grid h-7 w-7 place-items-center rounded-full border-2 border-slate-950 bg-slate-50 text-xs font-semibold text-slate-950 sm:h-12 sm:w-12 sm:text-base">{index + 1}</div>
            <article className="roadmap-stage min-w-0 border-t border-slate-300 pt-4 sm:pt-6">
              <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{priorityLabels[stage.priority]}</p>
                  <p className="mt-2 text-sm font-semibold text-slate-950">{stage.period}</p>
                </div>
                <div>
                  <h3 className="font-brand text-xl font-semibold leading-tight text-slate-950 sm:text-2xl">{stage.title}</h3>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-700 sm:leading-7">{stage.objective || 'Выполнить задачи этапа и зафиксировать результат перед переходом к следующему шагу.'}</p>
                </div>
              </div>

              <ol className="mt-6 divide-y divide-slate-200 border-y border-slate-200">
                {stage.tasks.map((task, taskIndex) => (
                  <li key={`${stage.id}-${taskIndex}`} className="grid gap-2 py-4 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-3 sm:py-5">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wide text-slate-500">{categoryLabels[task.category]}</span>
                      <p className="mt-1 text-xs leading-5 text-slate-600">{task.deadline}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-950">{task.title}</h4>
                      <p className="mt-2 text-sm leading-6 text-slate-600 sm:leading-7">{task.reason}</p>
                      {task.result && <p className="mt-2 border-l-2 border-slate-300 pl-3 text-sm leading-6 text-slate-700"><span className="font-semibold">Готовый результат:</span> {task.result}</p>}
                      {task.source_url && <p className="mt-3"><SourceLink href={task.source_url}>Источник требования</SourceLink></p>}
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-5 bg-slate-100 px-4 py-4 text-sm leading-6 text-slate-700">
                <span className="font-semibold text-slate-950">Контрольная точка этапа:</span>{' '}
                {stage.checkpoint || 'Проверьте выполненные результаты и скорректируйте следующий этап.'}
              </div>
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}

export const AdmissionsWorkspace: React.FC<AdmissionsWorkspaceProps> = ({ profile }) => {
  const [plan, setPlan] = useState<AdmissionsPlan | null>(() => loadAdmissionsPlan(profile));
  const [selectedId, setSelectedId] = useState(() => plan?.universities[0]?.id || '');
  const [history, setHistory] = useState(listAdmissionsHistory);
  const [historicalPlan, setHistoricalPlan] = useState<AdmissionsPlan | null>(null);
  const [detailOpenId, setDetailOpenId] = useState('');
  const [favoriteIds, setFavoriteIds] = useState(() => loadPlannerState(profile.id).favorite_university_ids);
  const [isLoading, setIsLoading] = useState(() => !plan && recommendationsAvailable());
  const [error, setError] = useState('');
  const abortRef = useRef<AbortController | null>(null);

  const requestPlan = useCallback(async () => {
    if (!recommendationsAvailable()) {
      setError('Сервис рекомендаций не подключён. Проверьте адрес API в настройках сайта.');
      return;
    }
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    let timedOut = false;
    const timeout = window.setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, 90_000);
    setIsLoading(true);
    setError('');
    try {
      const nextPlan = await generateAdmissionsPlan(profile, controller.signal);
      setPlan(nextPlan);
      setSelectedId(nextPlan.universities[0].id);
      setDetailOpenId('');
      saveAdmissionsPlan(profile, nextPlan);
      setHistory(saveHistoryPlan(nextPlan));
      setHistoricalPlan(null);
    } catch (requestError) {
      if (requestError instanceof DOMException && requestError.name === 'AbortError' && !timedOut) return;
      setError(timedOut ? 'Ответ занимает слишком много времени. Попробуйте ещё раз.' : requestError instanceof AdmissionsApiError ? requestError.message : 'Не удалось получить рекомендации. Попробуйте ещё раз.');
    } finally {
      window.clearTimeout(timeout);
      if (abortRef.current === controller) setIsLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    if (!plan) void requestPlan();
    return () => abortRef.current?.abort();
  }, [plan, requestPlan]);

  const displayedPlan = historicalPlan ?? plan;
  const selectedUniversity = useMemo(
    () => displayedPlan?.universities.find((university) => university.id === selectedId) || displayedPlan?.universities[0],
    [displayedPlan, selectedId],
  );

  if (!displayedPlan) {
    return (
      <section className="border-t border-slate-300 py-10" aria-live="polite">
        {isLoading ? (
          <><LoaderCircle className="h-6 w-6 animate-spin text-slate-700" aria-hidden="true" /><h2 className="mt-4 font-brand text-2xl font-semibold text-slate-950">Составляем рекомендации</h2><p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">Подбираем университеты по анкете и собираем сравнение. Это может занять до минуты.</p></>
        ) : (
          <><h2 className="font-brand text-2xl font-semibold text-slate-950">Рекомендации пока недоступны</h2><p role="alert" className="mt-2 max-w-xl text-sm leading-6 text-rose-700">{error || 'Не удалось загрузить результат.'}</p><button type="button" onClick={requestPlan} disabled={!recommendationsAvailable()} className="mt-5 min-h-11 border-b-2 border-slate-950 text-sm font-semibold text-slate-950 disabled:opacity-50">Попробовать снова</button></>
        )}
        {history.length > 0 && <div className="mt-6 border-t border-slate-200 pt-4"><p className="text-sm font-semibold text-slate-950">Сохранённые ответы</p><div className="mt-2 flex flex-wrap gap-4">{history.map((entry) => <button key={entry.id} type="button" onClick={() => { const saved = loadHistoryPlan(entry.id); if (saved) { setHistoricalPlan(saved); setSelectedId(saved.universities[0]?.id || ''); setDetailOpenId(''); } }} className="text-sm text-slate-700 underline underline-offset-4">{new Date(entry.created_at).toLocaleString('ru-RU')}</button>)}</div></div>}
      </section>
    );
  }

  return (
    <div className="editorial-page admissions-workspace">
      {history.length > 0 && (
        <section className="mb-8 border-b border-slate-200 pb-6" aria-label="История рекомендаций">
          <h2 className="text-sm font-semibold text-slate-950">История рекомендаций</h2>
          <p className="mt-1 text-xs leading-5 text-slate-500">В этом браузере сохранены последние {history.length} версий. Cookie хранит список версий, полные ответы — в локальном хранилище устройства.</p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
            {plan && <button type="button" onClick={() => { setHistoricalPlan(null); setSelectedId(plan.universities[0]?.id || ''); setDetailOpenId(''); }} className={`text-sm underline underline-offset-4 ${!historicalPlan ? 'font-semibold text-slate-950' : 'text-slate-600'}`}>Текущий ответ</button>}
            {history.map((entry, index) => <button key={entry.id} type="button" onClick={() => { const saved = loadHistoryPlan(entry.id); if (saved) { setHistoricalPlan(saved); setSelectedId(saved.universities[0]?.id || ''); setDetailOpenId(''); } }} className="text-left text-sm text-slate-600 underline decoration-slate-300 underline-offset-4 hover:text-slate-950">{new Date(entry.created_at).toLocaleString('ru-RU')} · версия {history.length - index}</button>)}
          </div>
        </section>
      )}
      {historicalPlan && <p className="mb-6 border-l-2 border-slate-400 pl-3 text-sm text-slate-600">Показана сохранённая версия. Новые правки анкеты относятся только к текущему ответу.</p>}
      <section className="border-b border-slate-300 pb-7" aria-label="Общий вывод">
        <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Главный вывод</p><p className="mt-3 max-w-4xl font-brand text-xl font-semibold leading-8 text-slate-950 sm:text-2xl">{displayedPlan.strategy_summary}</p></div><button type="button" onClick={requestPlan} disabled={isLoading} className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-slate-700 hover:text-black disabled:opacity-50">{isLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />} Обновить</button></div>
        {error && <p role="alert" className="mt-3 text-sm text-rose-700">{error}</p>}
        {displayedPlan.personalization.length > 0 && <div className="mt-7 max-w-4xl border-t border-slate-200 pt-5"><h2 className="text-sm font-semibold text-slate-950">Почему вывод такой</h2><ul className="mt-3 space-y-2 text-sm leading-7 text-slate-700">{displayedPlan.personalization.map((reason, index) => <li key={`${index}-${reason}`}>— {reason}</li>)}</ul></div>}
        <p className="mt-4 text-xs leading-5 text-slate-500">{displayedPlan.research_mode === 'google_search' ? 'Поиск источников включён. Проверяйте актуальные требования на страницах университетов.' : 'Онлайн-проверка источников недоступна. Данные о цене, сроках и правилах не показаны как подтверждённые факты.'}</p>
      </section>

      <section className="mt-9" id="universities" aria-labelledby="universities-title">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Подборка по анкете</p>
        <h2 id="universities-title" className="mt-2 font-brand text-3xl font-semibold text-slate-950">Университеты</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600 lg:hidden">Проведите в сторону, чтобы увидеть все варианты. Нажмите «Подробнее» для персональной стратегии поступления.</p>
        <div className="mt-6 grid gap-8 lg:mt-7 lg:grid-cols-[340px_minmax(0,1fr)]">
          <nav aria-label="Подобранные университеты" className="university-list -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 lg:mx-0 lg:block lg:divide-y lg:divide-slate-200 lg:overflow-visible lg:border-y lg:border-slate-300 lg:px-0 lg:pb-0">
            {displayedPlan.universities.map((university, index) => (
              <div key={university.id} className={`flex min-w-[82vw] snap-start items-center gap-3 border border-slate-200 p-4 sm:min-w-[320px] lg:min-w-0 lg:border-0 lg:py-4 lg:px-0 ${selectedUniversity?.id === university.id ? 'bg-slate-50 lg:bg-transparent' : 'bg-white'}`}>
                <span className="w-5 shrink-0 text-xs font-semibold text-slate-400">{String(index + 1).padStart(2, '0')}</span>
                <div className="min-w-0 flex-1"><button type="button" aria-pressed={selectedUniversity?.id === university.id} onClick={() => { setSelectedId(university.id); setDetailOpenId(''); }} className={`block min-h-11 min-w-0 text-left ${selectedUniversity?.id === university.id ? 'text-slate-950' : 'text-slate-600 hover:text-slate-950'}`}><span className="block text-sm font-semibold leading-5">{university.name}</span><span className="mt-1 block text-xs">{fitLabels[university.fit_level]} · {university.country}</span></button><button type="button" aria-controls="university-detail" aria-expanded={selectedUniversity?.id === university.id && detailOpenId === university.id} onClick={() => { setSelectedId(university.id); setDetailOpenId(university.id); }} className="mt-1 min-h-11 text-xs font-semibold text-slate-700 underline decoration-slate-300 underline-offset-4 hover:text-slate-950">Подробнее</button></div>
                <Chance university={university} />
              </div>
            ))}
          </nav>
          {selectedUniversity && <UniversityDetail university={selectedUniversity} plan={displayedPlan} expanded={detailOpenId === selectedUniversity.id} isFavorite={favoriteIds.includes(selectedUniversity.id)} onToggleFavorite={() => setFavoriteIds(toggleFavoriteUniversity(profile.id, selectedUniversity).favorite_university_ids)} />}
        </div>
      </section>

      <Comparison plan={displayedPlan} />
      <Roadmap plan={displayedPlan} />

      <section className="mt-12 border-t border-slate-300 pt-7" aria-labelledby="sources-title">
        <h2 id="sources-title" className="font-brand text-2xl font-semibold text-slate-950">Источники и ограничения</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{displayedPlan.disclaimer || 'Данные о поступлении меняются. Перед подачей проверьте сроки и требования на официальном сайте программы.'}</p>
        {displayedPlan.sources.length > 0 && <ul className="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2">{displayedPlan.sources.map((source) => <li key={source.url}><SourceLink href={source.url}>{source.title}</SourceLink></li>)}</ul>}
      </section>
    </div>
  );
};
