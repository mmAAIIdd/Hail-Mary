import React, { useState } from 'react';
import { ArrowRight, Edit3 } from 'lucide-react';
import { UserProfile } from '../../types/profile';
import { AdmissionsWorkspace } from '../admissions/AdmissionsWorkspace';

interface DiagnosisViewProps {
  profile: UserProfile;
  onEditProfile: () => void;
  onAddContext: (context: string) => void;
  onOpenRoadmap: () => void;
}

export const DiagnosisView: React.FC<DiagnosisViewProps> = ({ profile, onEditProfile, onAddContext, onOpenRoadmap }) => {
  const [context, setContext] = useState(profile.additional_context ?? '');
  return (
  <main className="editorial-page diagnosis-page mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
    <header className="diagnosis-header mb-8 flex flex-col gap-5 border-b border-slate-200 pb-7 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-semibold text-slate-500">Анкета завершена <span aria-hidden="true">/</span> <span className="text-slate-950">Рекомендации</span>{profile.basic_info.first_name && <span> · {profile.basic_info.first_name}</span>}</p>
        <h1 className="mt-2 max-w-3xl font-brand text-3xl font-semibold leading-tight text-slate-950 sm:text-5xl">
          Ваши рекомендации
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
          Университеты и сравнение вариантов по вашей анкете.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={onOpenRoadmap} className="atlas-button inline-flex min-h-11 items-center justify-center gap-2 px-4 text-sm font-semibold text-white">
          Открыть путь <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={onEditProfile}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-950 hover:text-slate-950"
        >
          <Edit3 className="h-4 w-4" aria-hidden="true" />
          Изменить анкету
        </button>
      </div>
    </header>

    <form className="context-form mb-8 border-b border-slate-200 pb-8" onSubmit={(event) => {
      event.preventDefault();
      const nextContext = context.trim();
      if (nextContext !== (profile.additional_context ?? '')) onAddContext(nextContext);
    }}>
      <label htmlFor="profile-context" className="block text-sm font-semibold text-slate-950">Добавить поправку к анкете</label>
      <p className="mt-1 text-sm leading-6 text-slate-600">Например: «Планирую IELTS в ноябре», «Уже веду школьный клуб» или «Хочу изучать биоинформатику». Не указывайте паспортные данные.</p>
      <textarea id="profile-context" maxLength={1000} rows={3} value={context} onChange={(event) => setContext(event.target.value)} className="mt-3 w-full border border-slate-300 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-slate-950" placeholder="Что изменилось или что важно учесть?" />
      <button type="submit" disabled={context.trim() === (profile.additional_context ?? '')} className="mt-3 min-h-11 border-b-2 border-slate-950 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-40">Учесть и обновить рекомендации</button>
    </form>

    <AdmissionsWorkspace key={profile.updated_at} profile={profile} />
  </main>
);
};
