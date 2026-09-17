import { UserProfile } from '../types/profile';

const PROFILE_KEY = 'locus_admitflow_profile_v1';
const STEP_KEY = 'locus_admitflow_questionnaire_step';

export function loadStoredProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse stored profile', e);
    return null;
  }
}

export function saveStoredProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile', e);
  }
}

export function clearStoredProfile(): void {
  try {
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(STEP_KEY);
  } catch (e) {
    console.error('Failed to clear profile', e);
  }
}

export function loadStoredStep(): number {
  try {
    const step = localStorage.getItem(STEP_KEY);
    return step ? parseInt(step, 10) : 1;
  } catch {
    return 1;
  }
}

export function saveStoredStep(step: number): void {
  try {
    localStorage.setItem(STEP_KEY, step.toString());
  } catch (e) {
    console.error('Failed to save step', e);
  }
}

