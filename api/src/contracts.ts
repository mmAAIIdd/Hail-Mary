import { z } from 'zod';

const httpsUrlSchema = z.string().url().refine(
  (value) => new URL(value).protocol === 'https:',
  'URL must use HTTPS',
);
const optionalSourceUrlSchema = z.union([z.literal(''), httpsUrlSchema]);
const examResultSchema = (minimum: number, maximum: number) => z.discriminatedUnion('status', [
  z.object({ status: z.literal('not_taken'), score: z.null() }).strict(),
  z.object({ status: z.literal('taken'), score: z.number().finite().min(minimum).max(maximum) }).strict(),
]);

export const profileSchema = z.object({
  basic_info: z.object({
    age: z.number().int().min(12).max(22),
    grade: z.enum(['8', '9', '10', '11']),
    target_intake_year: z.number().int().min(2026).max(2040),
  }),
  academics: z.object({
    interests: z.array(z.string().trim().min(1).max(80)).min(1).max(8),
    main_subject: z.string().trim().min(1).max(80),
    performance_level: z.enum(['excellent', 'good', 'average', 'needs_support']),
    grades_detail: z.string().trim().max(300).optional(),
    language_level: z.string().trim().max(100).optional(),
    language_exam: z.string().trim().max(120).optional(),
    other_exams: z.string().trim().max(180).optional(),
    target_program: z.string().trim().max(120).optional(),
    school_system: z.string().trim().max(120).optional(),
    exam_results: z.object({
      IELTS: examResultSchema(0, 9).optional(),
      TOEFL: examResultSchema(0, 120).optional(),
      SAT: examResultSchema(400, 1600).optional(),
      ЕНТ: examResultSchema(0, 140).optional(),
    }).strict().optional(),
  }),
  activities: z.object({
    current: z.string().trim().max(500),
    interested_in: z.array(z.enum(['Исследование', 'Волонтёрство', 'Школьный клуб', 'Олимпиады', 'Личный проект', 'Стажировка'])).max(6),
    time_per_week: z.number().int().min(0).max(40).nullable(),
    achievements: z.string().trim().max(400).optional(),
  }).optional(),
  additional_context: z.string().trim().max(1000).optional(),
  custom_aspects: z.array(z.object({
    title: z.string().trim().min(1).max(60),
    detail: z.string().trim().min(1).max(500),
  }).strict()).max(6).optional(),
  preferences: z.object({
    countries: z.array(z.string().trim().min(1).max(80)).min(1).max(10),
  }),
  budget: z.object({
    range: z.enum(['under_10000', '10000_20000', '20000_40000', 'over_40000']),
    max_total_usd_year: z.number().int().min(1_000).max(250_000),
    scholarship_criticality: z.enum(['critical', 'important', 'bonus', 'not_needed']),
  }),
  application_preferences: z.object({
    timeline: z.enum(['six_months', 'one_year', 'one_two_years', 'exploring']),
    foundation: z.enum(['yes', 'consider', 'no']),
    financial_aid: z.enum(['yes', 'consider', 'no']),
    work_during_studies: z.enum(['yes', 'consider', 'no']),
  }),
}).strict();

const moneySchema = z.object({
  min_usd: z.number().int().nonnegative(),
  max_usd: z.number().int().nonnegative(),
  note: z.string().trim().min(1).max(240),
});

const universitySchema = z.object({
  id: z.string().trim().min(2).max(80),
  name: z.string().trim().min(2).max(160),
  country: z.string().trim().min(2).max(80),
  city: z.string().trim().min(1).max(80),
  official_url: httpsUrlSchema,
  program_name: z.string().trim().min(2).max(180),
  fit_score: z.number().int().min(1).max(100),
  fit_level: z.enum(['ambitious', 'balanced', 'safer']),
  admission_chance: z.object({
    percent: z.number().int().min(1).max(99),
    confidence: z.enum(['low', 'medium', 'high']),
    explanation: z.string().trim().min(10).max(360),
    factors: z.array(z.object({
      label: z.string().trim().min(2).max(80),
      score: z.number().int().min(1).max(100),
      note: z.string().trim().min(2).max(180),
    })).min(3).max(5),
  }),
  why_fit: z.array(z.string().trim().min(1).max(240)).min(2).max(4),
  concerns: z.array(z.string().trim().min(1).max(240)).min(1).max(4),
  details: z.object({
    academic_fit: z.string().trim().min(20).max(650),
    choice_reason: z.string().trim().min(20).max(650),
    open_questions: z.string().trim().min(20).max(650),
    first_step: z.string().trim().min(15).max(450),
  }),
  annual_cost: moneySchema,
  scholarships: z.array(z.string().trim().min(1).max(180)).max(4),
  work_rules_note: z.string().trim().min(1).max(280),
  foundation_note: z.string().trim().min(1).max(280),
  deadline_note: z.string().trim().min(1).max(280),
  deadline_source_url: optionalSourceUrlSchema,
});

const roadmapStageSchema = z.object({
  id: z.string().trim().min(1).max(60),
  period: z.string().trim().min(1).max(80),
  title: z.string().trim().min(2).max(140),
  priority: z.enum(['now', 'next', 'later']),
  tasks: z.array(z.object({
    category: z.enum(['deadlines', 'academics', 'activities', 'exams', 'grades', 'olympiads', 'portfolio', 'personality', 'documents', 'finance']),
    title: z.string().trim().min(2).max(180),
    reason: z.string().trim().min(2).max(500),
    deadline: z.string().trim().min(2).max(100),
    result: z.string().trim().min(2).max(250),
    source_url: optionalSourceUrlSchema,
  })).min(3).max(8),
});

const sourceSchema = z.object({
  title: z.string().trim().min(1).max(180),
  url: httpsUrlSchema,
});

export const admissionsPlanSchema = z.object({
  strategy_summary: z.string().trim().min(20).max(1600),
  personalization: z.array(z.string().trim().min(20).max(350)).min(3).max(6),
  universities: z.array(universitySchema).length(6),
  roadmap: z.array(roadmapStageSchema).min(3).max(5),
  next_actions: z.array(z.string().trim().min(2).max(200)).min(3).max(5),
  sources: z.array(sourceSchema).max(20),
  disclaimer: z.string().trim().min(10).max(400),
});

export type AdmissionsProfile = z.infer<typeof profileSchema>;
export type AdmissionsPlan = z.infer<typeof admissionsPlanSchema>;

export const admissionsResponseSchema = admissionsPlanSchema.extend({
  generated_at: z.string().datetime(),
  model: z.string().min(1),
});

export const responseJsonSchema = {
  type: 'object',
  properties: {
    strategy_summary: { type: 'string', description: 'Краткая стратегия поступления на русском языке.' },
    personalization: { type: 'array', minItems: 3, maxItems: 6, items: { type: 'string' } },
    universities: {
      type: 'array',
      minItems: 6,
      maxItems: 6,
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          country: { type: 'string' },
          city: { type: 'string' },
          official_url: { type: 'string' },
          program_name: { type: 'string' },
          fit_score: { type: 'integer', minimum: 1, maximum: 100 },
          fit_level: { type: 'string', enum: ['ambitious', 'balanced', 'safer'] },
          admission_chance: {
            type: 'object',
            properties: {
              percent: { type: 'integer', minimum: 1, maximum: 99 },
              confidence: { type: 'string', enum: ['low', 'medium', 'high'] },
              explanation: { type: 'string' },
              factors: {
                type: 'array', minItems: 3, maxItems: 5,
                items: {
                  type: 'object',
                  properties: { label: { type: 'string' }, score: { type: 'integer', minimum: 1, maximum: 100 }, note: { type: 'string' } },
                  required: ['label', 'score', 'note'],
                },
              },
            },
            required: ['percent', 'confidence', 'explanation', 'factors'],
          },
          why_fit: { type: 'array', minItems: 2, maxItems: 4, items: { type: 'string' } },
          concerns: { type: 'array', minItems: 1, maxItems: 4, items: { type: 'string' } },
          details: {
            type: 'object',
            properties: {
              academic_fit: { type: 'string' },
              choice_reason: { type: 'string' },
              open_questions: { type: 'string' },
              first_step: { type: 'string' },
            },
            required: ['academic_fit', 'choice_reason', 'open_questions', 'first_step'],
          },
          annual_cost: {
            type: 'object',
            properties: {
              min_usd: { type: 'integer', minimum: 0 },
              max_usd: { type: 'integer', minimum: 0 },
              note: { type: 'string' },
            },
            required: ['min_usd', 'max_usd', 'note'],
          },
          scholarships: { type: 'array', maxItems: 4, items: { type: 'string' } },
          work_rules_note: { type: 'string' },
          foundation_note: { type: 'string' },
          deadline_note: { type: 'string' },
          deadline_source_url: { type: 'string' },
        },
        required: ['id', 'name', 'country', 'city', 'official_url', 'program_name', 'fit_score', 'fit_level', 'admission_chance', 'why_fit', 'concerns', 'details', 'annual_cost', 'scholarships', 'work_rules_note', 'foundation_note', 'deadline_note', 'deadline_source_url'],
      },
    },
    roadmap: {
      type: 'array',
      minItems: 3,
      maxItems: 5,
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          period: { type: 'string' },
          title: { type: 'string' },
          priority: { type: 'string', enum: ['now', 'next', 'later'] },
          tasks: {
            type: 'array',
            minItems: 3,
            maxItems: 8,
            items: {
              type: 'object',
              properties: {
                category: { type: 'string', enum: ['deadlines', 'academics', 'activities', 'exams', 'grades', 'olympiads', 'portfolio', 'personality', 'documents', 'finance'] },
                title: { type: 'string' },
                reason: { type: 'string' },
                deadline: { type: 'string' },
                result: { type: 'string' },
                source_url: { type: 'string' },
              },
              required: ['category', 'title', 'reason', 'deadline', 'result', 'source_url'],
            },
          },
        },
        required: ['id', 'period', 'title', 'priority', 'tasks'],
      },
    },
    next_actions: { type: 'array', minItems: 3, maxItems: 5, items: { type: 'string' } },
    sources: {
      type: 'array',
      minItems: 0,
      maxItems: 20,
      items: {
        type: 'object',
        properties: { title: { type: 'string' }, url: { type: 'string' } },
        required: ['title', 'url'],
      },
    },
    disclaimer: { type: 'string' },
  },
  required: ['strategy_summary', 'personalization', 'universities', 'roadmap', 'next_actions', 'sources', 'disclaimer'],
} as const;
