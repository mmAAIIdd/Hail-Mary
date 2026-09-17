import React from 'react';
import { X, HelpCircle, ArrowRight } from 'lucide-react';

interface ExplainModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  category: 'strength' | 'gap' | 'constraint';
  grounding?: string;
  whyItMatters: string;
  admissionImpact?: string;
  recommendedAction?: string;
}

export const ExplainModal: React.FC<ExplainModalProps> = ({
  isOpen,
  onClose,
  title,
  category,
  grounding,
  whyItMatters,
  admissionImpact,
  recommendedAction,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 sm:items-center sm:p-4">
      <div className="relative max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-slate-200 bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl sm:rounded-3xl sm:p-7">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 sm:right-5 sm:top-5"
          aria-label="Закрыть"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-4 flex items-start gap-2.5 pr-11">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              category === 'strength'
                ? 'bg-emerald-50 text-emerald-700'
                : category === 'gap'
                ? 'bg-amber-50 text-amber-700'
                : 'bg-slate-100 text-slate-800'
            }`}
          >
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {category === 'strength'
                ? 'Обоснование сильной стороны'
                : category === 'gap'
                ? 'Анализ точки роста'
                : 'Внешнее ограничение'}
            </span>
            <h3 className="text-base font-bold leading-tight text-slate-900">
              {title}
            </h3>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 border-t border-slate-100 pt-4 text-sm leading-6 text-slate-600">
          {grounding && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-semibold text-slate-800 block mb-1">
                Фактическое основание в вашей анкете:
              </span>
              <span className="text-slate-700">{grounding}</span>
            </div>
          )}

          <div>
            <span className="font-semibold text-slate-800 block mb-1">
              Почему это важно для приемной комиссии:
            </span>
            <p className="text-slate-600">{whyItMatters}</p>
          </div>

          {admissionImpact && (
            <div>
              <span className="font-semibold text-slate-800 block mb-1">
                Влияние на стратегию поступления:
              </span>
              <p className="text-slate-600">{admissionImpact}</p>
            </div>
          )}

          {recommendedAction && (
            <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-900">
              <span className="font-bold block mb-1 flex items-center gap-1.5 text-slate-950">
                <ArrowRight className="w-3.5 h-3.5" /> Рекомендуемое действие:
              </span>
              <p className="text-sm leading-6 text-slate-700">{recommendedAction}</p>
            </div>
          )}
        </div>

        {/* Bottom Button */}
        <div className="mt-6 flex justify-end border-t border-slate-100 pt-4">
          <button
            onClick={onClose}
            className="min-h-11 w-full rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 sm:w-auto"
          >
            Понятно
          </button>
        </div>
      </div>
    </div>
  );
};
