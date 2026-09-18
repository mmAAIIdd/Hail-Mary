const STORAGE_PREFIX = 'hail_mary_roadmap_progress_v1_';

interface StoredRoadmapProgress {
  version: 1;
  plan_key: string;
  completed_task_ids: string[];
}

function storageKey(profileId: string): string {
  return `${STORAGE_PREFIX}${profileId}`;
}

export function loadRoadmapProgress(profileId: string, planKey: string): string[] {
  try {
    const raw = localStorage.getItem(storageKey(profileId));
    if (!raw) return [];
    const stored = JSON.parse(raw) as Partial<StoredRoadmapProgress>;
    if (stored.version !== 1 || stored.plan_key !== planKey || !Array.isArray(stored.completed_task_ids)) {
      return [];
    }
    return stored.completed_task_ids.filter((id): id is string => typeof id === 'string').slice(0, 100);
  } catch {
    return [];
  }
}

export function saveRoadmapProgress(profileId: string, planKey: string, completedTaskIds: string[]): void {
  const progress: StoredRoadmapProgress = {
    version: 1,
    plan_key: planKey,
    completed_task_ids: [...new Set(completedTaskIds)].slice(0, 100),
  };

  try {
    localStorage.setItem(storageKey(profileId), JSON.stringify(progress));
  } catch (error) {
    console.error('Не удалось сохранить прогресс по roadmap', error);
  }
}

export function clearRoadmapProgress(profileId: string): void {
  try {
    localStorage.removeItem(storageKey(profileId));
  } catch (error) {
    console.error('Не удалось очистить прогресс по roadmap', error);
  }
}
