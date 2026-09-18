import { z } from 'zod';

const httpsUrlSchema = z.string().url().refine(
  (value) => new URL(value).protocol === 'https:',
  'URL must use HTTPS',
);

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
  }),
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
  max_usd: z.number().int().positive(),
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
  why_fit: z.array(z.string().trim().min(1).max(240)).min(2).max(4),
  concerns: z.array(z.string().trim().min(1).max(240)).min(1).max(4),
  annual_cost: moneySchema,
  scholarships: z.array(z.string().trim().min(1).max(180)).max(4),
  work_rules_note: z.string().trim().min(1).max(280),
  foundation_note: z.string().trim().min(1).max(280),
  deadline_note: z.string().trim().min(1).max(280),
});

const roadmapStageSchema = z.object({
  id: z.string().trim().min(1).max(60),
  period: z.string().trim().min(1).max(80),
  title: z.string().trim().min(2).max(140),
  priority: z.enum(['now', 'next', 'later']),
  tasks: z.array(z.object({
    title: z.string().trim().min(2).max(180),
    reason: z.string().trim().min(2).max(280),
  })).min(2).max(5),
});

const sourceSchema = z.object({
  title: z.string().trim().min(1).max(180),
  url: httpsUrlSchema,
});

export const admissionsPlanSchema = z.object({
  strategy_summary: z.string().trim().min(10).max(700),
  universities: z.array(universitySchema).length(6),
  roadmap: z.array(roadmapStageSchema).min(3).max(5),
  next_actions: z.array(z.string().trim().min(2).max(200)).min(3).max(5),
  sources: z.array(sourceSchema).min(3).max(20),
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
          why_fit: { type: 'array', minItems: 2, maxItems: 4, items: { type: 'string' } },
          concerns: { type: 'array', minItems: 1, maxItems: 4, items: { type: 'string' } },
          annual_cost: {
            type: 'object',
            properties: {
              min_usd: { type: 'integer', minimum: 0 },
              max_usd: { type: 'integer', minimum: 1 },
              note: { type: 'string' },
            },
            required: ['min_usd', 'max_usd', 'note'],
          },
          scholarships: { type: 'array', maxItems: 4, items: { type: 'string' } },
          work_rules_note: { type: 'string' },
          foundation_note: { type: 'string' },
          deadline_note: { type: 'string' },
        },
        required: ['id', 'name', 'country', 'city', 'official_url', 'program_name', 'fit_score', 'fit_level', 'why_fit', 'concerns', 'annual_cost', 'scholarships', 'work_rules_note', 'foundation_note', 'deadline_note'],
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
            minItems: 2,
            maxItems: 5,
            items: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                reason: { type: 'string' },
              },
              required: ['title', 'reason'],
            },
          },
        },
        required: ['id', 'period', 'title', 'priority', 'tasks'],
      },
    },
    next_actions: { type: 'array', minItems: 3, maxItems: 5, items: { type: 'string' } },
    sources: {
      type: 'array',
      minItems: 3,
      maxItems: 20,
      items: {
        type: 'object',
        properties: { title: { type: 'string' }, url: { type: 'string' } },
        required: ['title', 'url'],
      },
    },
    disclaimer: { type: 'string' },
  },
  required: ['strategy_summary', 'universities', 'roadmap', 'next_actions', 'sources', 'disclaimer'],
} as const;
