import { UserProfile } from '../types/profile';

const PROFILE_KEY = 'hail_mary_profile_v2';
const OLD_PROFILE_KEYS = ['locus_admitflow_profile_v1', 'locus_admitflow_questionnaire_step'];

function removeOldProfileData(): void {
  OLD_PROFILE_KEYS.forEach((key) => localStorage.removeItem(key));
}

function isUserProfile(value: unknown): value is UserProfile {
  if (!value || typeof value !== 'object') return false;

  const profile = value as Partial<UserProfile>;
  return Boolean(
    profile.id
      && profile.basic_info?.first_name
      && profile.basic_info?.last_name
      && profile.basic_info?.grade
      && profile.academics?.main_subject
      && Array.isArray(profile.academics?.interests)
      && Array.isArray(profile.preferences?.countries)
      && profile.budget?.range
      && profile.application_preferences?.timeline,
  );
}

export function loadStoredProfile(): UserProfile | null {
  try {
    removeOldProfileData();
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    const profile: unknown = JSON.parse(raw);
    if (!isUserProfile(profile)) {
      localStorage.removeItem(PROFILE_KEY);
      return null;
    }
    return profile;
  } catch (error) {
    console.error('Не удалось прочитать сохранённый профиль', error);
    return null;
  }
}

export function saveStoredProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    removeOldProfileData();
  } catch (error) {
    console.error('Не удалось сохранить профиль', error);
  }
}

export function clearStoredProfile(): void {
  try {
    localStorage.removeItem(PROFILE_KEY);
    removeOldProfileData();
  } catch (error) {
    console.error('Не удалось удалить профиль', error);
  }
}
