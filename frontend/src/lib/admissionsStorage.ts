import { AdmissionsPlan } from '../types/admissions';
import { UserProfile } from '../types/profile';
import { normalizeAdmissionsPlan } from './admissionsApi';

const PLAN_KEY = 'hail_mary_admissions_plan_v3';

interface StoredPlan {
  profile_updated_at: string;
  plan: AdmissionsPlan;
}

export function loadAdmissionsPlan(profile: UserProfile): AdmissionsPlan | null {
  try {
    const raw = localStorage.getItem(PLAN_KEY);
    if (!raw) return null;
    const stored = JSON.parse(raw) as StoredPlan;
    if (stored.profile_updated_at !== profile.updated_at || !stored.plan?.universities?.length) {
      localStorage.removeItem(PLAN_KEY);
      return null;
    }
    return normalizeAdmissionsPlan(stored.plan);
  } catch {
    localStorage.removeItem(PLAN_KEY);
    return null;
  }
}

export function saveAdmissionsPlan(profile: UserProfile, plan: AdmissionsPlan): void {
  try {
    const stored: StoredPlan = { profile_updated_at: profile.updated_at, plan };
    localStorage.setItem(PLAN_KEY, JSON.stringify(stored));
  } catch (error) {
    console.error('Не удалось сохранить рекомендации', error);
  }
}

export function clearAdmissionsPlan(): void {
  localStorage.removeItem(PLAN_KEY);
}
