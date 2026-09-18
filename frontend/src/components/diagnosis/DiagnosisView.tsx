import React from 'react';
import { Edit3 } from 'lucide-react';
import { UserProfile } from '../../types/profile';
import { AdmissionsWorkspace } from '../admissions/AdmissionsWorkspace';

interface DiagnosisViewProps {
  profile: UserProfile;
  onEditProfile: () => void;
}

export const DiagnosisView: React.FC<DiagnosisViewProps> = ({ profile, onEditProfile }) => (
  <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
    <header className="mb-8 flex flex-col gap-5 border-b border-slate-200 pb-7 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
          Персональный центр поступления
        </span>
        <h1 className="mt-2 max-w-3xl font-brand text-3xl font-semibold leading-tight text-slate-950 sm:text-5xl">
          Стратегия поступления для {profile.basic_info.first_name || 'вашего профиля'}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
          Университеты, оценка шансов, аргументы и пошаговый план — в одном разборе.
        </p>
      </div>
      <button
        type="button"
        onClick={onEditProfile}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-950 hover:text-slate-950"
      >
        <Edit3 className="h-4 w-4" />
        Изменить анкету
      </button>
    </header>

    <AdmissionsWorkspace profile={profile} />
  </main>
);
