import { AdmissionsPlan, RoadmapStage, UniversityRecommendation } from '../types/admissions';
import { UserProfile } from '../types/profile';

const apiBaseUrl = (import.meta.env.VITE_ADMISSIONS_API_URL || '').replace(/\/$/, '');

export class AdmissionsApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = 'AdmissionsApiError';
  }
}

function profileForRecommendations(profile: UserProfile) {
  return {
    basic_info: {
      age: profile.basic_info.age,
      grade: profile.basic_info.grade,
      target_intake_year: profile.basic_info.target_intake_year,
    },
    academics: profile.academics,
    activities: profile.activities,
    additional_context: profile.additional_context,
    custom_aspects: profile.custom_aspects,
    preferences: profile.preferences,
    budget: profile.budget,
    application_preferences: profile.application_preferences,
  };
}

export function recommendationsAvailable(): boolean {
  return Boolean(apiBaseUrl);
}

function record(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function secureUrl(value: unknown): string {
  const candidate = text(value);
  try {
    return new URL(candidate).protocol === 'https:' ? candidate : '';
  } catch {
    return '';
  }
}

function stringList(value: unknown): string[] {
  return Array.isArray(value) ? value.map(text).filter(Boolean) : [];
}

const roadmapCategories = new Set([
  'deadlines', 'academics', 'activities', 'exams', 'grades',
  'olympiads', 'portfolio', 'personality', 'documents', 'finance',
]);

export function normalizeAdmissionsPlan(value: unknown): AdmissionsPlan {
  const raw = record(value);
  if (!raw || !Array.isArray(raw.universities) || raw.universities.length === 0 || !Array.isArray(raw.roadmap)) {
    throw new AdmissionsApiError('Сервис вернул неполный результат. Попробуйте обновить рекомендации.');
  }
  const researched = raw.research_mode === 'google_search';

  const universities = raw.universities.map((item, index): UniversityRecommendation => {
    const university = record(item);
    if (!university || !text(university.name)) {
      throw new AdmissionsApiError('Сервис вернул неполный список университетов. Попробуйте ещё раз.');
    }
    const cost = record(university.annual_cost);
    const details = record(university.details);
    const extracurricularStrategy = Array.isArray(details?.extracurricular_strategy)
      ? details.extracurricular_strategy.map(record).filter((item) => item !== null)
      : [];
    const chance = record(university.admission_chance);
    const acceptanceRate = record(university.acceptance_rate);
    const competition = record(university.competition_analysis);
    const factors = Array.isArray(chance?.factors) ? chance.factors.map(record).filter((factor) => factor !== null) : [];
    const percent = chance?.percent;
    const hasChance = typeof percent === 'number' && Number.isFinite(percent) && percent > 0 && percent < 100;

    return {
      id: text(university.id) || `university-${index}`,
      name: text(university.name),
      country: text(university.country),
      city: text(university.city),
      official_url: secureUrl(university.official_url),
      program_name: text(university.program_name),
      fit_score: typeof university.fit_score === 'number' ? Math.min(100, Math.max(0, university.fit_score)) : 0,
      fit_level: university.fit_level === 'ambitious' || university.fit_level === 'safer' ? university.fit_level : 'balanced',
      admission_chance: hasChance ? {
        percent: Math.round(percent),
        confidence: chance?.confidence === 'high' || chance?.confidence === 'medium' ? chance.confidence : 'low',
        explanation: text(chance?.explanation),
        factors: factors.map((factor) => ({
          label: text(factor.label),
          score: typeof factor.score === 'number' ? Math.min(100, Math.max(0, factor.score)) : 0,
          note: text(factor.note),
        })).filter((factor) => factor.label),
      } : null,
      acceptance_rate: {
        percent: researched && typeof acceptanceRate?.percent === 'number' && acceptanceRate.percent > 0 ? Math.min(100, acceptanceRate.percent) : null,
        scope: acceptanceRate?.scope === 'program' || acceptanceRate?.scope === 'university' ? acceptanceRate.scope : 'not_published',
        note: researched ? text(acceptanceRate?.note) : 'Проверенный показатель не найден: без официального источника acceptance rate не показывается.',
        source_url: researched ? secureUrl(acceptanceRate?.source_url) : '',
      },
      competition_analysis: {
        summary: text(competition?.summary),
        academic_position: text(competition?.academic_position),
        exam_position: text(competition?.exam_position),
        activity_position: text(competition?.activity_position),
        main_differentiator: text(competition?.main_differentiator),
        improvement_priorities: stringList(competition?.improvement_priorities),
      },
      why_fit: stringList(university.why_fit),
      concerns: stringList(university.concerns),
      details: {
        academic_fit: text(details?.academic_fit),
        choice_reason: text(details?.choice_reason),
        open_questions: text(details?.open_questions),
        first_step: text(details?.first_step),
        extracurricular_strategy: extracurricularStrategy.map((item) => ({
          activity: text(item.activity),
          why_for_program: text(item.why_for_program),
          first_30_days: text(item.first_30_days),
          evidence: text(item.evidence),
        })).filter((item) => item.activity),
      },
      annual_cost: {
        min_usd: typeof cost?.min_usd === 'number' ? cost.min_usd : 0,
        max_usd: typeof cost?.max_usd === 'number' ? cost.max_usd : 0,
        note: text(cost?.note),
      },
      scholarships: stringList(university.scholarships),
      work_rules_note: text(university.work_rules_note),
      foundation_note: text(university.foundation_note),
      deadline_note: text(university.deadline_note),
      deadline_source_url: researched ? secureUrl(university.deadline_source_url) : '',
    };
  });

  const roadmap = raw.roadmap.map((item, index): RoadmapStage => {
    const stage = record(item);
    const period = text(stage?.period);
    const tasks = Array.isArray(stage?.tasks) ? stage.tasks : [];
    return {
      id: text(stage?.id) || `stage-${index}`,
      period,
      title: text(stage?.title) || 'Этап подготовки',
      objective: text(stage?.objective),
      checkpoint: text(stage?.checkpoint),
      priority: stage?.priority === 'now' || stage?.priority === 'later' ? stage.priority : 'next',
      tasks: tasks.map((item) => {
        const task = record(item);
        const category = text(task?.category);
        return {
          category: roadmapCategories.has(category) ? category as AdmissionsPlan['roadmap'][number]['tasks'][number]['category'] : 'general' as const,
          title: text(task?.title),
          reason: text(task?.reason),
          deadline: text(task?.deadline) || period,
          result: text(task?.result),
          source_url: researched ? secureUrl(task?.source_url) : '',
        };
      }).filter((task) => task.title),
    };
  }).filter((stage) => stage.tasks.length);

  if (!roadmap.length) throw new AdmissionsApiError('Сервис не вернул план подготовки. Попробуйте ещё раз.');
  const sources = Array.isArray(raw.sources) ? raw.sources.map(record).filter((source) => source !== null) : [];
  return {
    strategy_summary: text(raw.strategy_summary) || 'Рекомендации по вашей анкете',
    personalization: stringList(raw.personalization),
    universities,
    roadmap_target_university: text(raw.roadmap_target_university) || universities[0]?.name || 'выбранный университет',
    roadmap,
    next_actions: stringList(raw.next_actions),
    sources: researched ? sources.map((source) => ({ title: text(source.title), url: secureUrl(source.url) })).filter((source) => source.title && source.url) : [],
    disclaimer: text(raw.disclaimer),
    generated_at: text(raw.generated_at),
    model: text(raw.model),
    research_mode: researched ? 'google_search' : 'model_only',
  };
}

export async function generateAdmissionsPlan(
  profile: UserProfile,
  signal?: AbortSignal,
): Promise<AdmissionsPlan> {
  if (!apiBaseUrl) {
    throw new AdmissionsApiError('Сервис рекомендаций пока не подключён к сайту.');
  }

  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl}/api/plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile: profileForRecommendations(profile) }),
      signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    throw new AdmissionsApiError('Не удалось связаться с сервисом рекомендаций.');
  }

  const payload = await response.json().catch(() => null) as AdmissionsPlan | { error?: string } | null;
  if (!response.ok) {
    const message = payload && 'error' in payload && payload.error
      ? payload.error
      : 'Не удалось построить рекомендации.';
    throw new AdmissionsApiError(message, response.status);
  }

  return normalizeAdmissionsPlan(payload);
}
