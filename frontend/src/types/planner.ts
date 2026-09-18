export type PlannerTaskCategory = 'extracurricular' | 'exam' | 'documents' | 'deadline' | 'essay' | 'other';

export interface PlannerTask {
  id: string;
  university_id: string;
  university_name: string;
  program_name: string;
  title: string;
  description: string;
  category: PlannerTaskCategory;
  source: 'ai_activity' | 'custom';
  due_date: string;
  completed: boolean;
  completion_note: string;
  created_at: string;
}

export interface PlannerState {
  version: 1;
  profile_id: string;
  favorite_university_ids: string[];
  tasks: PlannerTask[];
}

export interface PlannerReminder {
  title: string;
  university_name: string;
  due_date: string;
  days_remaining: number;
  overdue: boolean;
}
