export type ExamStatus = 'not_taken' | 'planned' | 'taken';
export type SchoolGrade = '8' | '9' | '10' | '11' | 'graduated';
export type PerformanceLevel = 'excellent' | 'good' | 'average' | 'needs_support';
export type ApplicationTimeline = 'six_months' | 'one_year' | 'one_two_years' | 'exploring';
export type PreferenceAnswer = 'yes' | 'consider' | 'no';
export type BudgetRange = 'under_10000' | '10000_20000' | '20000_40000' | 'over_40000';

export interface ExamDetail {
  status: ExamStatus;
  score?: number | string;
  planned_date?: string;
}

export interface ActivityItem {
  id: string;
  name: string;
  category: 
    | 'olympiad'
    | 'research'
    | 'robotics'
    | 'volunteering'
    | 'sport'
    | 'leadership'
    | 'startup'
    | 'programming'
    | 'art'
    | 'club'
    | 'other';
  role: string;
  duration: string;
  level: 'school' | 'city' | 'regional' | 'national' | 'international';
  achievements: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  type: 'academic' | 'competition' | 'award' | 'project' | 'publication' | 'certificate';
  issuer?: string;
  year?: string;
  description?: string;
}

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
    degree_type: 'Bachelor / Undergraduate';
    residence_country: string;
  };
  academics: {
    gpa: number;
    grading_scale: '5.0' | '4.0' | '100' | 'IB' | 'Other';
    favorite_subjects: string[];
    strong_subjects: string[];
    academic_fields: string[];
    intended_major: string;
    alternative_majors: string[];
    performance_level: PerformanceLevel;
  };
  exams: {
    english_level: 'B1' | 'B2' | 'C1' | 'C2' | 'Native';
    ielts: ExamDetail;
    toefl: ExamDetail;
    sat: ExamDetail;
    act: ExamDetail;
    other_exams?: string;
  };
  extracurriculars: ActivityItem[];
  achievements: AchievementItem[];
  preferences: {
    preferred_countries: string[];
    excluded_countries: string[];
    city_type: 'any' | 'large' | 'medium' | 'college_town';
    campus_type: 'any' | 'urban' | 'campus' | 'suburban';
    climate: 'any' | 'warm' | 'temperate' | 'cold';
    instruction_language: 'english_only' | 'bilingual';
    university_size: 'any' | 'large' | 'medium' | 'small';
    focus_orientation: 'balanced' | 'research' | 'career';
  };
  budget: {
    range: BudgetRange;
    max_tuition_usd_year: number;
    max_total_usd_year: number;
    scholarship_criticality: 'critical' | 'important' | 'bonus' | 'not_needed';
    need_based_aid_ready: boolean;
    merit_scholarships_ready: boolean;
    dormitory_needed: boolean;
  };
  application_preferences: {
    timeline: ApplicationTimeline;
    foundation: PreferenceAnswer;
    financial_aid: PreferenceAnswer;
    work_during_studies: PreferenceAnswer;
  };
  constraints: string[];
  additional_notes?: string;
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
  category: 'budget' | 'country' | 'visa' | 'language' | 'scholarship' | 'deadline' | 'housing';
  description: string;
  is_hard: boolean;
}

export interface DiagnosticProfileResult {
  summary: {
    grade_label: string;
    target_major: string;
    preferred_countries: string[];
    annual_budget_usd: number;
    english_summary: string;
    sat_summary: string;
    extracurricular_count: number;
    achievement_count: number;
  };
  strengths: DiagnosticStrength[];
  gaps: DiagnosticGap[];
  constraints: DiagnosticConstraint[];
  goal: {
    degree: string;
    major: string;
    alternative_majors: string[];
    target_intake: number;
    preferred_countries: string[];
    max_budget_usd: number;
  };
}
