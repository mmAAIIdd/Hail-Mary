import { AdmissionsPlan } from '../types/admissions';
import { normalizeAdmissionsPlan } from './admissionsApi';

const COOKIE_NAME = 'hail_mary_history_v1';
const STORAGE_PREFIX = 'hail_mary_history_plan_';
const MAX_ENTRIES = 5;
const COOKIE_AGE_SECONDS = 60 * 60 * 24 * 180;

export interface HistoryEntry {
  id: string;
  created_at: string;
}

function cookiePath(): string {
  return import.meta.env.BASE_URL || '/';
}

function writeIndex(entries: HistoryEntry[]): void {
  const secure = location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(entries))}; Max-Age=${COOKIE_AGE_SECONDS}; Path=${cookiePath()}; SameSite=Lax${secure}`;
}

export function listAdmissionsHistory(): HistoryEntry[] {
  try {
    const value = document.cookie.split('; ').find((part) => part.startsWith(`${COOKIE_NAME}=`))?.slice(COOKIE_NAME.length + 1);
    if (!value) return [];
    const entries: unknown = JSON.parse(decodeURIComponent(value));
    if (!Array.isArray(entries)) return [];
    return entries.filter((item): item is HistoryEntry =>
      item !== null && typeof item === 'object'
      && typeof item.id === 'string' && /^[a-f0-9-]{36}$/.test(item.id)
      && typeof item.created_at === 'string'
      && localStorage.getItem(`${STORAGE_PREFIX}${item.id}`) !== null,
    ).slice(0, MAX_ENTRIES);
  } catch {
    return [];
  }
}

export function loadHistoryPlan(id: string): AdmissionsPlan | null {
  if (!/^[a-f0-9-]{36}$/.test(id)) return null;
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${id}`);
    return raw ? normalizeAdmissionsPlan(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

export function saveHistoryPlan(plan: AdmissionsPlan): HistoryEntry[] {
  const entries = listAdmissionsHistory();
  const entry: HistoryEntry = {
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  };
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${entry.id}`, JSON.stringify(plan));
    const nextEntries = [entry, ...entries].slice(0, MAX_ENTRIES);
    writeIndex(nextEntries);
    entries.slice(MAX_ENTRIES - 1).forEach((old) => localStorage.removeItem(`${STORAGE_PREFIX}${old.id}`));
    return nextEntries;
  } catch (error) {
    console.error('Не удалось сохранить историю рекомендаций', error);
    return entries;
  }
}

export function clearAdmissionsHistory(): void {
  try {
    for (let index = localStorage.length - 1; index >= 0; index -= 1) {
      const key = localStorage.key(index);
      if (key?.startsWith(STORAGE_PREFIX)) localStorage.removeItem(key);
    }
    document.cookie = `${COOKIE_NAME}=; Max-Age=0; Path=${cookiePath()}; SameSite=Lax`;
  } catch (error) {
    console.error('Не удалось очистить историю рекомендаций', error);
  }
}
