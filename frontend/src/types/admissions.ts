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
  why_fit: string[];
  concerns: string[];
  annual_cost: {
    min_usd: number;
    max_usd: number;
    note: string;
  };
  scholarships: string[];
  work_rules_note: string;
  foundation_note: string;
  deadline_note: string;
}

export interface RoadmapStage {
  id: string;
  period: string;
  title: string;
  priority: 'now' | 'next' | 'later';
  tasks: Array<{
    title: string;
    reason: string;
  }>;
}

export interface AdmissionsPlan {
  strategy_summary: string;
  universities: UniversityRecommendation[];
  roadmap: RoadmapStage[];
  next_actions: string[];
  sources: Array<{ title: string; url: string }>;
  disclaimer: string;
  generated_at: string;
  model: string;
  research_mode?: 'google_search' | 'model_only';
}
