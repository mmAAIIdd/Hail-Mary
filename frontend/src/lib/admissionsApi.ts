import { AdmissionsPlan } from '../types/admissions';
import { UserProfile } from '../types/profile';

const apiBaseUrl = (import.meta.env.VITE_ADMISSIONS_API_URL || '').replace(/\/$/, '');

export class AdmissionsApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = 'AdmissionsApiError';
  }
}

function profileForRecommendations(profile: UserProfile) {
  return {
    basic_info: {
      age: profile.basic_info.age,
      grade: profile.basic_info.grade,
      target_intake_year: profile.basic_info.target_intake_year,
    },
    academics: profile.academics,
    preferences: profile.preferences,
    budget: profile.budget,
    application_preferences: profile.application_preferences,
  };
}

export function recommendationsAvailable(): boolean {
  return Boolean(apiBaseUrl);
}

export async function generateAdmissionsPlan(
  profile: UserProfile,
  signal?: AbortSignal,
): Promise<AdmissionsPlan> {
  if (!apiBaseUrl) {
    throw new AdmissionsApiError('Сервис рекомендаций пока не подключён к сайту.');
  }

  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl}/api/plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile: profileForRecommendations(profile) }),
      signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    throw new AdmissionsApiError('Не удалось связаться с сервисом рекомендаций.');
  }

  const payload = await response.json().catch(() => null) as AdmissionsPlan | { error?: string } | null;
  if (!response.ok) {
    const message = payload && 'error' in payload && payload.error
      ? payload.error
      : 'Не удалось построить рекомендации.';
    throw new AdmissionsApiError(message, response.status);
  }

  return payload as AdmissionsPlan;
}
