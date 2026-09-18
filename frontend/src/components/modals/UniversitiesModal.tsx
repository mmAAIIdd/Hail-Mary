import React from 'react';
import { ArrowRight, X } from 'lucide-react';

interface UniversitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartQuestionnaire: () => void;
}

export const UniversitiesModal: React.FC<UniversitiesModalProps> = ({
  isOpen,
  onClose,
  onStartQuestionnaire,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-4">
      <div className="modal-surface relative w-full max-w-xl rounded-t-3xl border border-slate-200 bg-white p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl sm:rounded-3xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
          aria-label="Закрыть"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="pr-12">
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Персональный подбор</span>
          <h2 className="mt-3 font-brand text-3xl font-semibold leading-tight text-slate-950">
            Университеты по вашей анкете
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Сервис учитывает страны, интересы, бюджет, сроки и финансовую помощь. В результате вы получите не менее трёх вариантов, сравнение и порядок подготовки до подачи.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            onClose();
            onStartQuestionnaire();
          }}
          className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-black sm:w-auto"
        >
          Заполнить анкету <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
