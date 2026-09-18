import React from 'react';
import { Edit3 } from 'lucide-react';
import { UserProfile } from '../../types/profile';
import { AdmissionsWorkspace } from './AdmissionsWorkspace';

interface RoadmapViewProps {
  profile: UserProfile;
  onEditProfile: () => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({ profile, onEditProfile }) => (
  <main className="editorial-page roadmap-page mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
    <header className="mb-8 flex flex-col gap-5 border-b border-slate-200 pb-7 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-semibold text-slate-500">Анкета завершена <span aria-hidden="true">/</span> <span className="text-slate-950">Путь к поступлению</span></p>
        <h1 className="mt-2 max-w-4xl font-brand text-3xl font-semibold leading-tight text-slate-950 sm:text-5xl">
          Ваш путь к поступлению
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
          Последовательный roadmap по вашей специальности, срокам, текущей подготовке и целевой программе.
        </p>
      </div>
      <button
        type="button"
        onClick={onEditProfile}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-950 hover:text-slate-950"
      >
        <Edit3 className="h-4 w-4" aria-hidden="true" />
        Изменить анкету
      </button>
    </header>

    <AdmissionsWorkspace key={profile.updated_at} profile={profile} mode="roadmap" />
  </main>
);
