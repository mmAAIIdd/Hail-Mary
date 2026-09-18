import { UniversityRecommendation } from '../types/admissions';
import { PlannerReminder, PlannerState, PlannerTask } from '../types/planner';

const STORAGE_PREFIX = 'hail_mary_planner_v1_';
export const PLANNER_UPDATED_EVENT = 'hail-mary-planner-updated';

function storageKey(profileId: string): string {
  return `${STORAGE_PREFIX}${profileId}`;
}

function emptyState(profileId: string): PlannerState {
  return { version: 1, profile_id: profileId, favorite_university_ids: [], tasks: [] };
}

function isTask(value: unknown): value is PlannerTask {
  if (!value || typeof value !== 'object') return false;
  const task = value as Partial<PlannerTask>;
  return Boolean(
    typeof task.id === 'string'
      && typeof task.university_id === 'string'
      && typeof task.university_name === 'string'
      && typeof task.title === 'string'
      && typeof task.category === 'string'
      && typeof task.due_date === 'string'
      && typeof task.completed === 'boolean',
  );
}

export function loadPlannerState(profileId: string): PlannerState {
  try {
    const raw = localStorage.getItem(storageKey(profileId));
    if (!raw) return emptyState(profileId);
    const value = JSON.parse(raw) as Partial<PlannerState>;
    if (value.version !== 1 || value.profile_id !== profileId) return emptyState(profileId);
    return {
      version: 1,
      profile_id: profileId,
      favorite_university_ids: Array.isArray(value.favorite_university_ids)
        ? value.favorite_university_ids.filter((id): id is string => typeof id === 'string')
        : [],
      tasks: Array.isArray(value.tasks) ? value.tasks.filter(isTask).slice(0, 200) : [],
    };
  } catch {
    return emptyState(profileId);
  }
}

export function savePlannerState(state: PlannerState): void {
  try {
    localStorage.setItem(storageKey(state.profile_id), JSON.stringify(state));
    window.dispatchEvent(new CustomEvent(PLANNER_UPDATED_EVENT, { detail: state.profile_id }));
  } catch (error) {
    console.error('Не удалось сохранить план поступления', error);
  }
}

function activityTasks(university: UniversityRecommendation): PlannerTask[] {
  const now = new Date().toISOString();
  return university.details.extracurricular_strategy.map((activity, index) => ({
    id: `${university.id}:activity:${index}`,
    university_id: university.id,
    university_name: university.name,
    program_name: university.program_name,
    title: activity.activity,
    description: `${activity.why_for_program} Первые 30 дней: ${activity.first_30_days} Доказательство: ${activity.evidence}`,
    category: 'extracurricular',
    source: 'ai_activity',
    due_date: '',
    completed: false,
    completion_note: '',
    created_at: now,
  }));
}

export function toggleFavoriteUniversity(profileId: string, university: UniversityRecommendation): PlannerState {
  const state = loadPlannerState(profileId);
  const isFavorite = state.favorite_university_ids.includes(university.id);
  const favoriteIds = isFavorite
    ? state.favorite_university_ids.filter((id) => id !== university.id)
    : [...state.favorite_university_ids, university.id];
  const existingIds = new Set(state.tasks.map((task) => task.id));
  const newTasks = isFavorite
    ? []
    : activityTasks(university).filter((task) => !existingIds.has(task.id));
  const next = { ...state, favorite_university_ids: favoriteIds, tasks: [...state.tasks, ...newTasks] };
  savePlannerState(next);
  return next;
}

export function updatePlannerTask(profileId: string, taskId: string, patch: Partial<Pick<PlannerTask, 'completed' | 'completion_note' | 'due_date'>>): PlannerState {
  const state = loadPlannerState(profileId);
  const next = {
    ...state,
    tasks: state.tasks.map((task) => task.id === taskId ? { ...task, ...patch } : task),
  };
  savePlannerState(next);
  return next;
}

export function addPlannerTask(profileId: string, task: Omit<PlannerTask, 'id' | 'created_at' | 'source' | 'completed' | 'completion_note'>): PlannerState {
  const state = loadPlannerState(profileId);
  const nextTask: PlannerTask = {
    ...task,
    id: crypto.randomUUID(),
    source: 'custom',
    completed: false,
    completion_note: '',
    created_at: new Date().toISOString(),
  };
  const next = { ...state, tasks: [...state.tasks, nextTask].slice(-200) };
  savePlannerState(next);
  return next;
}

export function removePlannerTask(profileId: string, taskId: string): PlannerState {
  const state = loadPlannerState(profileId);
  const next = { ...state, tasks: state.tasks.filter((task) => task.id !== taskId) };
  savePlannerState(next);
  return next;
}

export function getNextPlannerReminder(profileId: string): PlannerReminder | null {
  const state = loadPlannerState(profileId);
  const tasks = state.tasks.filter((task) =>
    !task.completed
      && /^\d{4}-\d{2}-\d{2}$/.test(task.due_date)
      && (task.source === 'custom' || state.favorite_university_ids.includes(task.university_id)),
  );
  if (!tasks.length) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  tasks.sort((a, b) => a.due_date.localeCompare(b.due_date));
  const task = tasks[0];
  const due = new Date(`${task.due_date}T00:00:00`);
  const daysRemaining = Math.ceil((due.getTime() - today.getTime()) / 86_400_000);
  return {
    title: task.title,
    university_name: task.university_name,
    due_date: task.due_date,
    days_remaining: daysRemaining,
    overdue: daysRemaining < 0,
  };
}

export function clearPlannerState(profileId: string): void {
  try {
    localStorage.removeItem(storageKey(profileId));
  } catch (error) {
    console.error('Не удалось очистить план поступления', error);
  }
}
