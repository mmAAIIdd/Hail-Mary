import React, { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import {
  ApplicationTimeline,
  BudgetRange,
  ExamName,
  PerformanceLevel,
  PreferenceAnswer,
  SchoolGrade,
  UserProfile,
} from '../../types/profile';

interface QuestionnaireProps {
  initialProfile: UserProfile | null;
  onComplete: (profile: UserProfile) => void;
  onCancel?: () => void;
}

interface QuestionnaireDraft {
  firstName: string;
  lastName: string;
  grade: SchoolGrade | '';
  age: number | '';
  interests: string;
  mainSubject: string;
  performance: PerformanceLevel | '';
  gradesDetail: string;
  languageLevel: string;
  languageExam: string;
  otherExams: string;
  examResults: Record<ExamName, { status: 'not_taken' | 'taken'; score: string }>;
  targetProgram: string;
  schoolSystem: string;
  currentActivities: string;
  achievements: string;
  activitiesToTry: string[];
  timePerWeek: number | '';
  additionalContext: string;
  customAspects: Array<{ title: string; detail: string }>;
  countries: string[];
  timeline: ApplicationTimeline | '';
  foundation: PreferenceAnswer | '';
  budgetRange: BudgetRange | '';
  scholarship: UserProfile['budget']['scholarship_criticality'] | '';
  financialAid: PreferenceAnswer | '';
  workDuringStudies: PreferenceAnswer | '';
}

interface ChoiceOption {
  value: string;
  label: string;
  description?: string;
}

interface ChoiceGroupProps {
  value: string;
  options: ChoiceOption[];
  onChange: (value: string) => void;
  columns?: 2 | 4;
}

const STEPS = [
  {
    title: 'Расскажите о себе',
    description: 'Начнём с основных данных. Они нужны, чтобы учитывать ваш возраст и этап обучения.',
  },
  {
    title: 'Учёба и интересы',
    description: 'Укажите, что вам интересно и как вы оцениваете текущую успеваемость.',
  },
  {
    title: 'Опыт и новые занятия',
    description: 'Расскажите, что уже делаете вне уроков и что готовы попробовать сейчас. Отсутствие опыта — нормальная отправная точка.',
  },
  {
    title: 'Страны и сроки',
    description: 'Определим географию поиска и насколько быстро вы планируете подавать документы.',
  },
  {
    title: 'Бюджет и возможности',
    description: 'Эти ответы помогут исключить финансово неподходящие варианты заранее.',
  },
] as const;

const COUNTRIES = [
  'США',
  'Канада',
  'Великобритания',
  'Германия',
  'Италия',
  'Нидерланды',
  'Южная Корея',
  'ОАЭ',
];

const ACTIVITY_OPTIONS = ['Исследование', 'Волонтёрство', 'Школьный клуб', 'Олимпиады', 'Личный проект', 'Стажировка'];
const EXAM_CONFIG: Record<ExamName, { min: number; max: number; step: number; hint: string }> = {
  IELTS: { min: 0, max: 9, step: 0.5, hint: '0–9' },
  TOEFL: { min: 0, max: 120, step: 1, hint: '0–120' },
  SAT: { min: 400, max: 1600, step: 10, hint: '400–1600' },
  ЕНТ: { min: 0, max: 140, step: 1, hint: '0–140' },
};
const EXAM_NAMES = Object.keys(EXAM_CONFIG) as ExamName[];

function initialExamResults(profile: UserProfile | null): QuestionnaireDraft['examResults'] {
  return Object.fromEntries(EXAM_NAMES.map((name) => {
    const result = profile?.academics.exam_results?.[name];
    return [name, { status: result?.status ?? 'not_taken', score: result?.status === 'taken' ? String(result.score) : '' }];
  })) as QuestionnaireDraft['examResults'];
}

const PERFORMANCE_OPTIONS: ChoiceOption[] = [
  { value: 'excellent', label: 'Отличная', description: 'В основном высшие оценки' },
  { value: 'good', label: 'Хорошая', description: 'Стабильно выше среднего' },
  { value: 'average', label: 'Средняя', description: 'Есть сильные и слабые предметы' },
  { value: 'needs_support', label: 'Нужно улучшить', description: 'Есть заметные пробелы' },
];

const TIMELINE_OPTIONS: ChoiceOption[] = [
  { value: 'six_months', label: 'В ближайшие 6 месяцев' },
  { value: 'one_year', label: 'В течение года' },
  { value: 'one_two_years', label: 'Через 1–2 года' },
  { value: 'exploring', label: 'Пока изучаю варианты' },
];

const FOUNDATION_OPTIONS: ChoiceOption[] = [
  { value: 'yes', label: 'Да, рассматриваю' },
  { value: 'consider', label: 'Нужно больше информации' },
  { value: 'no', label: 'Нет, хочу прямое поступление' },
];

const BUDGET_OPTIONS: ChoiceOption[] = [
  { value: 'under_10000', label: 'До $10 000', description: 'за год' },
  { value: '10000_20000', label: '$10 000–20 000', description: 'за год' },
  { value: '20000_40000', label: '$20 000–40 000', description: 'за год' },
  { value: 'over_40000', label: 'Более $40 000', description: 'за год' },
];

const SCHOLARSHIP_OPTIONS: ChoiceOption[] = [
  { value: 'critical', label: 'Обязательна', description: 'Без неё обучение невозможно' },
  { value: 'important', label: 'Очень важна', description: 'Сильно влияет на решение' },
  { value: 'bonus', label: 'Желательна', description: 'Но не является условием' },
  { value: 'not_needed', label: 'Не требуется' },
];

const YES_CONSIDER_NO: ChoiceOption[] = [
  { value: 'yes', label: 'Да, обязательно' },
  { value: 'consider', label: 'Желательно / не уверен' },
  { value: 'no', label: 'Нет' },
];

function ChoiceGroup({
  value,
  options,
  onChange,
  columns = 2,
}: ChoiceGroupProps) {
  return (
    <div className={columns === 4 ? 'grid gap-3 sm:grid-cols-2 lg:grid-cols-4' : 'grid gap-3 sm:grid-cols-2'}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
            className={
              selected
                ? 'min-h-16 border border-slate-950 bg-slate-950 px-4 py-3 text-left text-white'
                : 'min-h-16 border border-slate-200 bg-white px-4 py-3 text-left text-slate-900 transition hover:border-slate-400'
            }
          >
            <span className="block text-sm font-semibold">{option.label}</span>
            {option.description && (
              <span className={selected ? 'mt-1 block text-xs text-white/65' : 'mt-1 block text-xs text-slate-500'}>
                {option.description}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function CustomAspects({ aspects, onChange }: {
  aspects: QuestionnaireDraft['customAspects'];
  onChange: (aspects: QuestionnaireDraft['customAspects']) => void;
}) {
  return (
    <section id="custom-aspects" className="border-t border-slate-200 pt-7">
      <h2 className="text-lg font-semibold text-slate-950">Добавьте то, что важно о вас</h2>
      <p className="mt-1 text-sm leading-6 text-slate-600">Не нашли подходящего вопроса? Добавьте свой аспект — он попадёт в рекомендации. До шести пунктов.</p>
      <div className="mt-4 space-y-5">{aspects.map((aspect, index) => (
        <div key={index} className="border-l-2 border-slate-300 pl-4">
          <input aria-label={`Название аспекта ${index + 1}`} maxLength={60} value={aspect.title} onChange={(event) => onChange(aspects.map((item, position) => position === index ? { ...item, title: event.target.value } : item))} placeholder="Например: исследовательский проект" className="h-11 w-full border-b border-slate-300 text-sm outline-none focus:border-slate-950" />
          <textarea aria-label={`Описание аспекта ${index + 1}`} maxLength={500} rows={2} value={aspect.detail} onChange={(event) => onChange(aspects.map((item, position) => position === index ? { ...item, detail: event.target.value } : item))} placeholder="Что именно ИИ должен учесть?" className="mt-2 w-full border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-950" />
          <button type="button" onClick={() => onChange(aspects.filter((_, position) => position !== index))} className="mt-1 text-xs text-slate-600 underline underline-offset-4">Удалить аспект</button>
        </div>
      ))}</div>
      {aspects.length < 6 && <button type="button" onClick={() => onChange([...aspects, { title: '', detail: '' }])} className="mt-4 inline-flex min-h-11 items-center border border-slate-950 px-5 text-sm font-semibold text-slate-950 transition hover:bg-slate-950 hover:text-white">+ Добавить свои данные</button>}
    </section>
  );
}

function createDraft(profile: UserProfile | null): QuestionnaireDraft {
  return {
    firstName: profile?.basic_info.first_name ?? '',
    lastName: profile?.basic_info.last_name ?? '',
    grade: profile?.basic_info.grade ?? '',
    age: profile?.basic_info.age ?? '',
    interests: profile?.academics.interests.join(', ') ?? '',
    mainSubject: profile?.academics.main_subject ?? '',
    performance: profile?.academics.performance_level ?? '',
    gradesDetail: profile?.academics.grades_detail ?? '',
    languageLevel: profile?.academics.language_level ?? '',
    languageExam: profile?.academics.language_exam ?? '',
    otherExams: profile?.academics.other_exams ?? '',
    examResults: initialExamResults(profile),
    targetProgram: profile?.academics.target_program ?? '',
    schoolSystem: profile?.academics.school_system ?? '',
    currentActivities: profile?.activities?.current ?? '',
    achievements: profile?.activities?.achievements ?? '',
    activitiesToTry: profile?.activities?.interested_in ?? [],
    timePerWeek: profile?.activities?.time_per_week ?? '',
    additionalContext: profile?.additional_context ?? '',
    customAspects: profile?.custom_aspects ?? [],
    countries: profile?.preferences.countries ?? [],
    timeline: profile?.application_preferences.timeline ?? '',
    foundation: profile?.application_preferences.foundation ?? '',
    budgetRange: profile?.budget.range ?? '',
    scholarship: profile?.budget.scholarship_criticality ?? '',
    financialAid: profile?.application_preferences.financial_aid ?? '',
    workDuringStudies: profile?.application_preferences.work_during_studies ?? '',
  };
}

function splitInterests(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 8);
}

function maximumAnnualBudget(range: BudgetRange): number {
  const values: Record<BudgetRange, number> = {
    under_10000: 10000,
    '10000_20000': 20000,
    '20000_40000': 40000,
    over_40000: 60000,
  };
  return values[range];
}

function targetIntakeYear(timeline: ApplicationTimeline): number {
  const currentYear = new Date().getFullYear();
  const offsets: Record<ApplicationTimeline, number> = {
    six_months: 1,
    one_year: 1,
    one_two_years: 2,
    exploring: 3,
  };
  return currentYear + offsets[timeline];
}

export const Questionnaire: React.FC<QuestionnaireProps> = ({
  initialProfile,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [draft, setDraft] = useState<QuestionnaireDraft>(() => createDraft(initialProfile));
  const [customCountry, setCustomCountry] = useState('');
  const [error, setError] = useState('');

  const progress = ((currentStep + 1) / STEPS.length) * 100;
  const step = STEPS[currentStep];

  const selectedCountrySet = useMemo(() => new Set(draft.countries), [draft.countries]);

  const updateDraft = <Key extends keyof QuestionnaireDraft>(
    key: Key,
    value: QuestionnaireDraft[Key],
  ) => {
    setDraft((previous) => ({ ...previous, [key]: value }));
    setError('');
  };

  const toggleCountry = (country: string) => {
    const countries = selectedCountrySet.has(country)
      ? draft.countries.filter((item) => item !== country)
      : [...draft.countries, country];
    updateDraft('countries', countries);
  };

  const addCustomCountry = () => {
    const country = customCountry.trim();
    if (!country) return;
    if (!selectedCountrySet.has(country)) {
      updateDraft('countries', [...draft.countries, country]);
    }
    setCustomCountry('');
  };

  const validateCurrentStep = (): string => {
    if (currentStep === 0) {
      if (!draft.firstName.trim() || !draft.lastName.trim()) {
        return 'Введите имя и фамилию.';
      }
      if (!draft.grade) return 'Выберите текущий класс.';
      if (draft.age === '' || draft.age < 12 || draft.age > 22) {
        return 'Укажите возраст от 12 до 22 лет.';
      }
      if (draft.customAspects.some((aspect) => !aspect.title.trim() || !aspect.detail.trim())) {
        return 'Заполните название и описание каждого добавленного аспекта или удалите пустой.';
      }
    }

    if (currentStep === 1) {
      if (splitInterests(draft.interests).length === 0) {
        return 'Укажите хотя бы один интерес.';
      }
      if (!draft.mainSubject.trim()) return 'Укажите главный предмет.';
      if (!draft.performance) return 'Выберите текущую успеваемость.';
      for (const name of EXAM_NAMES) {
        const result = draft.examResults[name];
        const config = EXAM_CONFIG[name];
        if (result.status === 'taken' && (!result.score.trim() || !Number.isFinite(Number(result.score)) || Number(result.score) < config.min || Number(result.score) > config.max)) {
          return `Укажите балл ${name} в диапазоне ${config.hint} или выберите «Не сдавал(а)».`;
        }
      }
    }

    if (currentStep === 2) {
      if (draft.timePerWeek !== '' && (draft.timePerWeek < 0 || draft.timePerWeek > 40 || !Number.isInteger(draft.timePerWeek))) {
        return 'Укажите от 0 до 40 часов в неделю.';
      }
    }

    if (currentStep === 3) {
      if (draft.countries.length === 0) return 'Выберите хотя бы одну страну.';
      if (!draft.timeline) return 'Выберите планируемые сроки подачи.';
      if (!draft.foundation) return 'Укажите отношение к программе Foundation.';
    }

    if (currentStep === 4) {
      if (!draft.budgetRange) return 'Выберите годовой бюджет.';
      if (!draft.scholarship) return 'Укажите важность стипендии.';
      if (!draft.financialAid) return 'Ответьте на вопрос о financial aid.';
      if (!draft.workDuringStudies) {
        return 'Укажите, нужна ли возможность работать во время учёбы.';
      }
    }

    return '';
  };

  const buildProfile = (): UserProfile => {
    const interests = splitInterests(draft.interests);
    const budgetRange = draft.budgetRange as BudgetRange;
    const now = new Date().toISOString();

    return {
      id: initialProfile?.id ?? `profile-${Date.now()}`,
      created_at: initialProfile?.created_at ?? now,
      updated_at: now,
      basic_info: {
        first_name: draft.firstName.trim(),
        last_name: draft.lastName.trim(),
        age: draft.age as number,
        grade: draft.grade as SchoolGrade,
        target_intake_year: targetIntakeYear(draft.timeline as ApplicationTimeline),
      },
      academics: {
        interests,
        main_subject: draft.mainSubject.trim(),
        performance_level: draft.performance as PerformanceLevel,
        grades_detail: draft.gradesDetail.trim(),
        language_level: draft.languageLevel.trim(),
        language_exam: draft.languageExam.trim(),
        other_exams: draft.otherExams.trim(),
        target_program: draft.targetProgram.trim(),
        school_system: draft.schoolSystem.trim(),
        exam_results: Object.fromEntries(EXAM_NAMES.map((name) => [name, draft.examResults[name].status === 'taken'
          ? { status: 'taken', score: Number(draft.examResults[name].score) }
          : { status: 'not_taken', score: null }])),
      },
      activities: {
        current: draft.currentActivities.trim(),
        interested_in: draft.activitiesToTry,
        time_per_week: draft.timePerWeek === '' ? null : draft.timePerWeek,
        achievements: draft.achievements.trim(),
      },
      additional_context: draft.additionalContext.trim(),
      custom_aspects: draft.customAspects.map((aspect) => ({ title: aspect.title.trim(), detail: aspect.detail.trim() })),
      preferences: {
        countries: draft.countries,
      },
      budget: {
        range: budgetRange,
        max_total_usd_year: maximumAnnualBudget(budgetRange),
        scholarship_criticality:
          draft.scholarship as UserProfile['budget']['scholarship_criticality'],
      },
      application_preferences: {
        timeline: draft.timeline as ApplicationTimeline,
        foundation: draft.foundation as PreferenceAnswer,
        financial_aid: draft.financialAid as PreferenceAnswer,
        work_during_studies: draft.workDuringStudies as PreferenceAnswer,
      },
    };
  };

  const handleNext = () => {
    const validationError = validateCurrentStep();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (currentStep < STEPS.length - 1) {
      setCurrentStep((previous) => previous + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    onComplete(buildProfile());
  };

  const handleBack = () => {
    if (currentStep === 0) return;
    setError('');
    setCurrentStep((previous) => previous - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-8 sm:py-14">
      <header className="mb-10">
        <div className="mb-5 flex items-center justify-between gap-4">
          <span className="text-sm font-semibold text-slate-500">
            Шаг {currentStep + 1} из {STEPS.length}
          </span>
          <span className="text-sm text-slate-500">
            {Math.round(progress)}% заполнено
          </span>
        </div>
        <div className="h-1.5 overflow-hidden bg-slate-200">
          <div
            className="h-full bg-slate-950 transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      <section className="border border-slate-200 bg-white px-5 py-7 sm:px-10 sm:py-10">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-400">
            {initialProfile ? 'Редактирование анкеты' : 'Анкета абитуриента'}
          </p>
          <h1 className="mt-3 font-brand text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl">
            {step.title}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            {step.description}
          </p>
        </div>

        <div className="mt-9 border-t border-slate-200 pt-8">
          {currentStep === 0 && (
            <div className="space-y-8">
              <div className="grid gap-6 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-800">Имя</span>
                  <input
                    type="text"
                    autoComplete="given-name"
                    value={draft.firstName}
                    onChange={(event) => updateDraft('firstName', event.target.value)}
                    placeholder="Например, Алина"
                    className="h-14 w-full border border-slate-300 px-4 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-950"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-800">Фамилия</span>
                  <input
                    type="text"
                    autoComplete="family-name"
                    value={draft.lastName}
                    onChange={(event) => updateDraft('lastName', event.target.value)}
                    placeholder="Например, Садыкова"
                    className="h-14 w-full border border-slate-300 px-4 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-950"
                  />
                </label>
              </div>

              <fieldset>
                <legend className="mb-3 text-sm font-semibold text-slate-800">
                  В каком вы классе?
                </legend>
                <ChoiceGroup
                  value={draft.grade}
                  columns={4}
                  options={(['8', '9', '10', '11'] as const).map((grade) => ({
                    value: grade,
                    label: `${grade} класс`,
                  }))}
                  onChange={(value) => updateDraft('grade', value as SchoolGrade)}
                />
              </fieldset>

              <label className="block max-w-xs">
                <span className="mb-2 block text-sm font-semibold text-slate-800">Возраст</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={12}
                  max={22}
                  value={draft.age}
                  onChange={(event) => {
                    const value = event.target.value;
                    updateDraft('age', value === '' ? '' : Number(value));
                  }}
                  placeholder="16"
                  className="h-14 w-full border border-slate-300 px-4 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-950"
                />
              </label>
              <CustomAspects aspects={draft.customAspects} onChange={(aspects) => updateDraft('customAspects', aspects)} />
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-8">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-800">
                  Ваши интересы
                </span>
                <input
                  type="text"
                  value={draft.interests}
                  onChange={(event) => updateDraft('interests', event.target.value)}
                  placeholder="Программирование, дизайн, экономика"
                  className="h-14 w-full border border-slate-300 px-4 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-950"
                />
                <span className="mt-2 block text-sm text-slate-500">
                  Перечислите через запятую до восьми направлений.
                </span>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-800">
                  Главный школьный предмет
                </span>
                <input
                  type="text"
                  value={draft.mainSubject}
                  onChange={(event) => updateDraft('mainSubject', event.target.value)}
                  placeholder="Например, математика"
                  className="h-14 w-full border border-slate-300 px-4 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-950"
                />
              </label>

              <fieldset>
                <legend className="mb-3 text-sm font-semibold text-slate-800">
                  Как вы оцениваете свою успеваемость?
                </legend>
                <ChoiceGroup
                  value={draft.performance}
                  options={PERFORMANCE_OPTIONS}
                  onChange={(value) =>
                    updateDraft('performance', value as PerformanceLevel)
                  }
                />
              </fieldset>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-800">Оценки по профильным предметам</span>
                <textarea maxLength={300} rows={2} value={draft.gradesDetail} onChange={(event) => updateDraft('gradesDetail', event.target.value)} placeholder="Например: математика 5/5, биология 4/5; укажите шкалу" className="w-full border border-slate-300 px-4 py-3 text-base outline-none focus:border-slate-950" />
                <span className="mt-1 block text-sm text-slate-500">Необязательно. Если не знаете точных оценок, оставьте пустым.</span>
              </label>
              <div className="grid gap-6 sm:grid-cols-2">
                <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-800">Уровень языка обучения</span><input maxLength={100} value={draft.languageLevel} onChange={(event) => updateDraft('languageLevel', event.target.value)} placeholder="Например: английский B2" className="h-14 w-full border border-slate-300 px-4 text-base outline-none focus:border-slate-950" /></label>
                <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-800">Дополнительный языковой экзамен или план</span><input maxLength={120} value={draft.languageExam} onChange={(event) => updateDraft('languageExam', event.target.value)} placeholder="Например: Duolingo English Test в ноябре" className="h-14 w-full border border-slate-300 px-4 text-base outline-none focus:border-slate-950" /></label>
              </div>
              <fieldset className="border-t border-slate-200 pt-6">
                <legend className="text-sm font-semibold text-slate-950">Результаты экзаменов</legend>
                <p className="mt-1 text-sm text-slate-600">Если не сдавали экзамен, так и оставьте. Баллы — ваши данные, не подтверждённые сертификатом.</p>
                <div className="mt-4 divide-y divide-slate-200 border-y border-slate-200">{EXAM_NAMES.map((name) => {
                  const result = draft.examResults[name];
                  const config = EXAM_CONFIG[name];
                  return <div key={name} className="grid gap-3 py-4 sm:grid-cols-[90px_1fr_150px] sm:items-center">
                    <span className="text-sm font-semibold text-slate-950">{name}</span>
                    <div className="flex flex-wrap gap-2">
                      <button type="button" aria-pressed={result.status === 'not_taken'} onClick={() => updateDraft('examResults', { ...draft.examResults, [name]: { status: 'not_taken', score: '' } })} className={result.status === 'not_taken' ? 'border border-slate-950 bg-slate-950 px-3 py-2 text-xs font-semibold text-white' : 'border border-slate-300 px-3 py-2 text-xs text-slate-700'}>Не сдавал(а)</button>
                      <button type="button" aria-pressed={result.status === 'taken'} onClick={() => updateDraft('examResults', { ...draft.examResults, [name]: { ...result, status: 'taken' } })} className={result.status === 'taken' ? 'border border-slate-950 bg-slate-950 px-3 py-2 text-xs font-semibold text-white' : 'border border-slate-300 px-3 py-2 text-xs text-slate-700'}>Есть результат</button>
                    </div>
                    {result.status === 'taken' && <label className="block"><span className="sr-only">Балл {name}</span><input type="number" inputMode="decimal" min={config.min} max={config.max} step={config.step} value={result.score} onChange={(event) => updateDraft('examResults', { ...draft.examResults, [name]: { status: 'taken', score: event.target.value } })} placeholder={`Балл ${config.hint}`} className="h-11 w-full border border-slate-300 px-3 text-sm outline-none focus:border-slate-950" /></label>}
                  </div>;
                })}</div>
              </fieldset>
              <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-800">Другие экзамены</span><input maxLength={180} value={draft.otherExams} onChange={(event) => updateDraft('otherExams', event.target.value)} placeholder="SAT, ACT, предметные экзамены — результат или план" className="h-14 w-full border border-slate-300 px-4 text-base outline-none focus:border-slate-950" /></label>
              <div className="grid gap-6 sm:grid-cols-2">
                <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-800">Желаемая специальность</span><input maxLength={120} value={draft.targetProgram} onChange={(event) => updateDraft('targetProgram', event.target.value)} placeholder="Например, биоинформатика" className="h-14 w-full border border-slate-300 px-4 text-base outline-none focus:border-slate-950" /></label>
                <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-800">Школьная программа</span><input maxLength={120} value={draft.schoolSystem} onChange={(event) => updateDraft('schoolSystem', event.target.value)} placeholder="Обычная школа, IB, A-Level и т. п." className="h-14 w-full border border-slate-300 px-4 text-base outline-none focus:border-slate-950" /></label>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-8">
              <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-800">Чем уже занимаетесь вне учёбы?</span><textarea maxLength={500} rows={3} value={draft.currentActivities} onChange={(event) => updateDraft('currentActivities', event.target.value)} placeholder="Клуб, проект, волонтёрство, олимпиада — или пока ничего" className="w-full border border-slate-300 px-4 py-3 text-base outline-none focus:border-slate-950" /></label>
              <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-800">Достижения и результаты</span><textarea maxLength={400} rows={2} value={draft.achievements} onChange={(event) => updateDraft('achievements', event.target.value)} placeholder="Только реальные результаты: роль в проекте, диплом, опубликованная работа" className="w-full border border-slate-300 px-4 py-3 text-base outline-none focus:border-slate-950" /></label>
              <fieldset><legend className="mb-3 text-sm font-semibold text-slate-800">Что хотели бы начать?</legend><div className="flex flex-wrap gap-2">{ACTIVITY_OPTIONS.map((activity) => <button key={activity} type="button" aria-pressed={draft.activitiesToTry.includes(activity)} onClick={() => updateDraft('activitiesToTry', draft.activitiesToTry.includes(activity) ? draft.activitiesToTry.filter((item) => item !== activity) : [...draft.activitiesToTry, activity])} className={draft.activitiesToTry.includes(activity) ? 'border border-slate-950 bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white' : 'border border-slate-300 px-4 py-2.5 text-sm text-slate-700 hover:border-slate-600'}>{activity}</button>)}</div></fieldset>
              <label className="block max-w-xs"><span className="mb-2 block text-sm font-semibold text-slate-800">Часов в неделю на новые занятия</span><input type="number" inputMode="numeric" min={0} max={40} value={draft.timePerWeek} onChange={(event) => updateDraft('timePerWeek', event.target.value === '' ? '' : Number(event.target.value))} placeholder="Например, 3" className="h-14 w-full border border-slate-300 px-4 text-base outline-none focus:border-slate-950" /></label>
              <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-800">Что ещё важно учесть?</span><textarea maxLength={1000} rows={3} value={draft.additionalContext} onChange={(event) => updateDraft('additionalContext', event.target.value)} placeholder="Уточнения, ограничения, цель или поправки к ответам" className="w-full border border-slate-300 px-4 py-3 text-base outline-none focus:border-slate-950" /></label>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-9">
              <fieldset>
                <legend className="mb-1 text-sm font-semibold text-slate-800">
                  Какие страны вы рассматриваете?
                </legend>
                <p className="mb-4 text-sm text-slate-500">Можно выбрать несколько.</p>
                <div className="flex flex-wrap gap-2.5">
                  {COUNTRIES.map((country) => {
                    const selected = selectedCountrySet.has(country);
                    return (
                      <button
                        key={country}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => toggleCountry(country)}
                        className={
                          selected
                            ? 'border border-slate-950 bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white'
                            : 'border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-slate-500'
                        }
                      >
                        {country}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-4 flex max-w-lg gap-2">
                  <input
                    type="text"
                    value={customCountry}
                    onChange={(event) => setCustomCountry(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        addCustomCountry();
                      }
                    }}
                    placeholder="Другая страна"
                    className="h-12 min-w-0 flex-1 border border-slate-300 px-4 text-base outline-none focus:border-slate-950"
                  />
                  <button
                    type="button"
                    onClick={addCustomCountry}
                    className="border border-slate-950 px-4 text-sm font-semibold text-slate-950"
                  >
                    Добавить
                  </button>
                </div>
              </fieldset>

              <fieldset>
                <legend className="mb-3 text-sm font-semibold text-slate-800">
                  Когда планируете подавать документы?
                </legend>
                <ChoiceGroup
                  value={draft.timeline}
                  options={TIMELINE_OPTIONS}
                  onChange={(value) =>
                    updateDraft('timeline', value as ApplicationTimeline)
                  }
                />
              </fieldset>

              <fieldset>
                <legend className="mb-1 text-sm font-semibold text-slate-800">
                  Рассматриваете Foundation?
                </legend>
                <p className="mb-4 text-sm leading-6 text-slate-500">
                  Foundation — подготовительный год перед бакалавриатом, если для прямого
                  поступления пока не хватает академических или языковых требований.
                </p>
                <ChoiceGroup
                  value={draft.foundation}
                  options={FOUNDATION_OPTIONS}
                  onChange={(value) =>
                    updateDraft('foundation', value as PreferenceAnswer)
                  }
                />
              </fieldset>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-9">
              <fieldset>
                <legend className="mb-1 text-sm font-semibold text-slate-800">
                  Какой общий бюджет доступен на один год?
                </legend>
                <p className="mb-4 text-sm text-slate-500">
                  Обучение и проживание вместе, в долларах США.
                </p>
                <ChoiceGroup
                  value={draft.budgetRange}
                  options={BUDGET_OPTIONS}
                  columns={4}
                  onChange={(value) =>
                    updateDraft('budgetRange', value as BudgetRange)
                  }
                />
              </fieldset>

              <fieldset>
                <legend className="mb-3 text-sm font-semibold text-slate-800">
                  Насколько важна стипендия?
                </legend>
                <ChoiceGroup
                  value={draft.scholarship}
                  options={SCHOLARSHIP_OPTIONS}
                  onChange={(value) =>
                    updateDraft(
                      'scholarship',
                      value as UserProfile['budget']['scholarship_criticality'],
                    )
                  }
                />
              </fieldset>

              <fieldset>
                <legend className="mb-1 text-sm font-semibold text-slate-800">
                  Нужен financial aid?
                </legend>
                <p className="mb-4 text-sm leading-6 text-slate-500">
                  Финансовая помощь от университета, рассчитанная с учётом дохода семьи.
                </p>
                <ChoiceGroup
                  value={draft.financialAid}
                  options={YES_CONSIDER_NO}
                  onChange={(value) =>
                    updateDraft('financialAid', value as PreferenceAnswer)
                  }
                />
              </fieldset>

              <fieldset>
                <legend className="mb-1 text-sm font-semibold text-slate-800">
                  Нужна возможность работать во время учёбы?
                </legend>
                <p className="mb-4 text-sm leading-6 text-slate-500">
                  Учтём страны и программы, где студентам разрешена подработка.
                </p>
                <ChoiceGroup
                  value={draft.workDuringStudies}
                  options={YES_CONSIDER_NO}
                  onChange={(value) =>
                    updateDraft('workDuringStudies', value as PreferenceAnswer)
                  }
                />
              </fieldset>
            </div>
          )}
        </div>

        {error && (
          <p role="alert" className="mt-7 border-l-2 border-rose-600 pl-4 text-sm font-medium text-rose-700">
            {error}
          </p>
        )}
      </section>

      <footer className="mt-6 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={handleBack}
          disabled={currentStep === 0}
          className="inline-flex h-12 items-center gap-2 px-2 text-sm font-semibold text-slate-600 transition hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ArrowLeft className="h-4 w-4" />
          Назад
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="inline-flex h-12 items-center gap-2 bg-slate-950 px-6 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          {currentStep === STEPS.length - 1 ? (initialProfile ? 'Сохранить и обновить рекомендации' : 'Получить результат') : 'Продолжить'}
          <ArrowRight className="h-4 w-4" />
        </button>
      </footer>
    </main>
  );
};
