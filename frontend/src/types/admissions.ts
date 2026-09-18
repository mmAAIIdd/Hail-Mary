export type UniversityFitLevel = 'ambitious' | 'balanced' | 'safer';

export interface UniversityRecommendation {
  id: string;
  name: string;
  country: string;
  city: string;
  official_url: string;
  program_name: string;
  fit_score: number;
  fit_level: UniversityFitLevel;
  admission_chance: {
    percent: number;
    confidence: 'low' | 'medium' | 'high';
    explanation: string;
    factors: Array<{
      label: string;
      score: number;
      note: string;
    }>;
  } | null;
  acceptance_rate: {
    percent: number | null;
    scope: 'program' | 'university' | 'not_published';
    note: string;
    source_url: string;
  };
  competition_analysis: {
    summary: string;
    academic_position: string;
    exam_position: string;
    activity_position: string;
    main_differentiator: string;
    improvement_priorities: string[];
  };
  why_fit: string[];
  concerns: string[];
  details: {
    academic_fit: string;
    choice_reason: string;
    open_questions: string;
    first_step: string;
    extracurricular_strategy: Array<{
      activity: string;
      why_for_program: string;
      first_30_days: string;
      evidence: string;
    }>;
  };
  annual_cost: {
    min_usd: number;
    max_usd: number;
    note: string;
  };
  scholarships: string[];
  work_rules_note: string;
  foundation_note: string;
  deadline_note: string;
  deadline_source_url: string;
}

export interface RoadmapStage {
  id: string;
  period: string;
  title: string;
  objective: string;
  checkpoint: string;
  priority: 'now' | 'next' | 'later';
  tasks: Array<{
    category: 'general' | 'deadlines' | 'academics' | 'activities' | 'exams' | 'grades' | 'olympiads' | 'portfolio' | 'personality' | 'documents' | 'finance';
    title: string;
    reason: string;
    deadline: string;
    result: string;
    source_url: string;
  }>;
}

export interface AdmissionsPlan {
  strategy_summary: string;
  personalization: string[];
  universities: UniversityRecommendation[];
  roadmap_target_university: string;
  roadmap: RoadmapStage[];
  next_actions: string[];
  sources: Array<{ title: string; url: string }>;
  disclaimer: string;
  generated_at: string;
  model: string;
  research_mode?: 'google_search' | 'model_only';
}
