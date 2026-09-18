import React, { useState } from 'react';
import { UserProfile, GapStatus } from '../../types/profile';
import { runProfileDiagnosis } from '../../lib/diagnosticEngine';
import { ExplainModal } from './ExplainModal';
import {
  CheckCircle2,
  AlertTriangle,
  Lock,
  Flag,
  Edit3,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

interface DiagnosisViewProps {
  profile: UserProfile;
  onEditProfile: () => void;
}

const performanceLabels = {
  excellent: 'Отличная',
  good: 'Хорошая',
  average: 'Средняя',
  needs_support: 'Нужно улучшить',
} as const;

export const DiagnosisView: React.FC<DiagnosisViewProps> = ({
  profile,
  onEditProfile,
}) => {
  const diagnosis = runProfileDiagnosis(profile);

  // Modal state for explainability
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    category: 'strength' | 'gap' | 'constraint';
    grounding?: string;
    whyItMatters: string;
    admissionImpact?: string;
    recommendedAction?: string;
  }>({
    isOpen: false,
    title: '',
    category: 'strength',
    whyItMatters: '',
  });

  const openExplainModal = (params: Omit<typeof modalState, 'isOpen'>) => {
    setModalState({ ...params, isOpen: true });
  };

  const getGapStatusBadge = (status: GapStatus) => {
    switch (status) {
      case 'missing_requirement':
        return (
          <span className="rounded-full border border-rose-200 bg-rose-50 px-2 py-1 text-[11px] font-semibold text-rose-700">
            Обязательное требование
          </span>
        );
      case 'potential_gap':
        return (
          <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-700">
            Стоит проверить
          </span>
        );
      case 'needs_improvement':
        return (
          <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-1 text-[11px] font-semibold text-blue-700">
            Можно улучшить
          </span>
        );
      case 'unknown':
      default:
        return (
          <span className="rounded-full border border-slate-200 bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700">
            Нужно уточнить
          </span>
        );
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-7 sm:px-6 sm:py-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Результат анкеты
          </span>
          <h1 className="mt-2 text-[28px] font-bold leading-[1.08] tracking-tight text-slate-900 sm:text-3xl">
            Ваш профиль поступления
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
            Здесь собраны ваши сильные стороны, задачи на подготовку и условия выбора университета.
          </p>
        </div>

        <button
          onClick={onEditProfile}
          className="inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 sm:w-auto sm:self-auto"
        >
          <Edit3 className="w-3.5 h-3.5 text-slate-700" />
          <span>Редактировать анкету</span>
        </button>
      </div>

      {/* 1. Profile Summary Card */}
      <div className="space-y-5 rounded-3xl border border-slate-200/90 bg-white p-4 shadow-sm sm:p-7">
        <div className="flex items-start justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white">
              {profile.basic_info.grade}
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">
                {[profile.basic_info.first_name, profile.basic_info.last_name].filter(Boolean).join(' ') || 'Профиль ученика'}
              </div>
              <div className="mt-0.5 text-xs leading-5 text-slate-500">
                {diagnosis.summary.grade_label} • {diagnosis.summary.main_interest} • поступление {diagnosis.goal.target_intake}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 border-t border-slate-100 pt-4 text-sm sm:grid-cols-4 sm:gap-3">
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
            <span className="mb-1 block text-xs text-slate-500">Успеваемость</span>
            <span className="font-bold leading-snug text-slate-800">
              {performanceLabels[profile.academics.performance_level]}
            </span>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
            <span className="mb-1 block text-xs text-slate-500">Главный предмет</span>
            <span className="block truncate font-bold text-slate-800">
              {profile.academics.main_subject}
            </span>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
            <span className="mb-1 block text-xs leading-tight text-slate-500">Страны</span>
            <span className="block truncate font-bold text-slate-800">
              {diagnosis.summary.preferred_countries.join(', ') || 'Не выбраны'}
            </span>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
            <span className="mb-1 block text-xs leading-tight text-slate-500">Бюджет в год</span>
            <span className="font-bold text-slate-800">
              до ${diagnosis.summary.annual_budget_usd.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* 2 & 3: Two Columns: Strengths & Gaps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="space-y-4">
          <div className="flex items-end justify-between gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">
                Сильные стороны ({diagnosis.strengths.length})
              </h2>
            </div>
          </div>

          {diagnosis.strengths.length === 0 ? (
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
              Заполните больше сведений об оценках и проектах, чтобы выявить сильные стороны.
            </div>
          ) : (
            <div className="space-y-3">
              {diagnosis.strengths.map((str) => (
                <div
                  key={str.id}
                  className="space-y-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm transition hover:border-emerald-200 sm:p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-bold leading-snug text-slate-900">
                      {str.title}
                    </h3>
                    <button
                      onClick={() =>
                        openExplainModal({
                          title: str.title,
                          category: 'strength',
                          grounding: str.grounding,
                          whyItMatters: str.why_it_matters,
                          admissionImpact: str.admission_impact,
                        })
                      }
                      className="text-slate-400 hover:text-emerald-600 transition shrink-0 p-0.5"
                      title="Почему это преимущество?"
                    >
                      <HelpCircle className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm leading-6 text-slate-600">
                    <span className="font-semibold text-slate-700">Основание: </span>
                    {str.grounding}
                  </div>

                  <div className="text-sm leading-6 text-slate-600">
                    <span className="font-semibold text-slate-700">Влияние на отбор: </span>
                    {str.admission_impact}
                  </div>

                  <button
                    onClick={() =>
                      openExplainModal({
                        title: str.title,
                        category: 'strength',
                        grounding: str.grounding,
                        whyItMatters: str.why_it_matters,
                        admissionImpact: str.admission_impact,
                      })
                    }
                    className="inline-flex min-h-10 items-center gap-1 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
                  >
                    <span>Почему это важно</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Gaps / Growth Points */}
        <div className="space-y-4">
          <div className="flex items-end justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h2 className="text-base font-bold text-slate-900">
                Что стоит улучшить ({diagnosis.gaps.length})
              </h2>
            </div>
          </div>

          {diagnosis.gaps.length === 0 ? (
            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-800">
              Критических расхождений с базовыми требованиями не обнаружено.
            </div>
          ) : (
            <div className="space-y-3">
              {diagnosis.gaps.map((gap) => (
                <div
                  key={gap.id}
                  className="space-y-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm transition hover:border-amber-200 sm:p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      {getGapStatusBadge(gap.status)}
                      <h3 className="text-sm font-bold leading-snug text-slate-900">
                        {gap.title}
                      </h3>
                    </div>
                    <button
                      onClick={() =>
                        openExplainModal({
                          title: gap.title,
                          category: 'gap',
                          whyItMatters: gap.why_it_matters,
                          recommendedAction: gap.recommended_action,
                        })
                      }
                      className="text-slate-400 hover:text-amber-600 transition shrink-0 p-0.5"
                      title="Что можно улучшить?"
                    >
                      <HelpCircle className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-sm leading-6 text-slate-600">
                    {gap.context}
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-100 p-3 text-sm leading-6 text-slate-900">
                    <span className="font-bold text-slate-950">Что сделать: </span>
                    {gap.recommended_action}
                  </div>

                  <button
                    onClick={() =>
                      openExplainModal({
                        title: gap.title,
                        category: 'gap',
                        whyItMatters: gap.why_it_matters,
                        recommendedAction: gap.recommended_action,
                      })
                    }
                    className="inline-flex min-h-10 items-center gap-1 text-sm font-semibold text-slate-900 transition hover:text-black"
                  >
                    <span>Что делать дальше</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-slate-800" />
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Условия выбора
              </h2>
              <div className="mt-1 text-sm leading-6 text-slate-500">
                Бюджет, страны и бытовые условия, которые важно учитывать заранее.
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {diagnosis.constraints.map((con) => (
            <div
              key={con.id}
              className="space-y-2 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-sm font-bold leading-snug text-slate-900">{con.title}</span>
                <span
                  className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                    con.is_hard
                      ? 'bg-rose-50 text-rose-700 border border-rose-100'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {con.is_hard ? 'Обязательно' : 'Желательно'}
                </span>
              </div>
              <p className="text-sm leading-6 text-slate-600">
                {con.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Target Goal Summary */}
      <div className="flex flex-col justify-between gap-6 rounded-3xl bg-black p-5 text-white sm:flex-row sm:items-center sm:p-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-1">
            <Flag className="w-4 h-4" />
            <span>Ваша цель</span>
          </div>
          <h3 className="text-lg font-bold text-white">
            {diagnosis.goal.main_interest}
          </h3>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
            Поступление в {diagnosis.goal.target_intake} году. Приоритетные страны:{' '}
            {diagnosis.goal.preferred_countries.join(', ') || 'Все доступные'}. Максимальный лимит расходов:{' '}
            ${diagnosis.goal.max_budget_usd.toLocaleString()}/год.
          </p>
        </div>

      </div>

      {/* Explainability Modal */}
      <ExplainModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
        title={modalState.title}
        category={modalState.category}
        grounding={modalState.grounding}
        whyItMatters={modalState.whyItMatters}
        admissionImpact={modalState.admissionImpact}
        recommendedAction={modalState.recommendedAction}
      />
    </div>
  );
};
