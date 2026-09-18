export type SchoolGrade = '8' | '9' | '10' | '11';
export type PerformanceLevel = 'excellent' | 'good' | 'average' | 'needs_support';
export type ApplicationTimeline = 'six_months' | 'one_year' | 'one_two_years' | 'exploring';
export type PreferenceAnswer = 'yes' | 'consider' | 'no';
export type BudgetRange = 'under_10000' | '10000_20000' | '20000_40000' | 'over_40000';

export interface UserProfile {
  id: string;
  created_at: string;
  updated_at: string;
  basic_info: {
    first_name: string;
    last_name: string;
    age: number;
    grade: SchoolGrade;
    target_intake_year: number;
  };
  academics: {
    interests: string[];
    main_subject: string;
    performance_level: PerformanceLevel;
  };
  preferences: { countries: string[] };
  budget: {
    range: BudgetRange;
    max_total_usd_year: number;
    scholarship_criticality: 'critical' | 'important' | 'bonus' | 'not_needed';
  };
  application_preferences: {
    timeline: ApplicationTimeline;
    foundation: PreferenceAnswer;
    financial_aid: PreferenceAnswer;
    work_during_studies: PreferenceAnswer;
  };
}

export type GapStatus = 'potential_gap' | 'missing_requirement' | 'needs_improvement' | 'unknown';

export interface DiagnosticStrength {
  id: string;
  title: string;
  grounding: string;
  admission_impact: string;
  why_it_matters: string;
}

export interface DiagnosticGap {
  id: string;
  title: string;
  status: GapStatus;
  context: string;
  why_it_matters: string;
  recommended_action: string;
}

export interface DiagnosticConstraint {
  id: string;
  title: string;
  category: 'budget' | 'country' | 'visa' | 'scholarship';
  description: string;
  is_hard: boolean;
}

export interface DiagnosticProfileResult {
  summary: {
    grade_label: string;
    main_interest: string;
    preferred_countries: string[];
    annual_budget_usd: number;
  };
  strengths: DiagnosticStrength[];
  gaps: DiagnosticGap[];
  constraints: DiagnosticConstraint[];
  goal: {
    main_interest: string;
    target_intake: number;
    preferred_countries: string[];
    max_budget_usd: number;
  };
}
