import React from 'react';
import { X, CheckCircle2, Clock, FileText, Globe } from 'lucide-react';

interface TipsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartQuestionnaire: () => void;
}

export const TipsModal: React.FC<TipsModalProps> = ({
  isOpen,
  onClose,
  onStartQuestionnaire,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-4">
      <div className="relative max-h-[94dvh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-slate-200 bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl sm:max-h-[90vh] sm:rounded-3xl sm:p-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 sm:right-5 sm:top-5"
          aria-label="Закрыть"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6 pr-11">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            База знаний абитуриента
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-slate-950 mt-1">
            Советы по поступлению
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Ключевые ориентиры для поступления на программы бакалавриата за рубежом.
          </p>
        </div>

        <div className="space-y-4 text-sm text-slate-600">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm">
              <Clock className="w-4 h-4 text-slate-700" />
              <span>1. Таймлайн и ранние дедлайны</span>
            </div>
            <p className="leading-relaxed text-slate-600">
              Подача на Early Action / Early Decision (октябрь–ноябрь) обычно имеет в 1.5–2 раза более высокий процент зачисления, чем регулярные дедлайны в январе. Начинайте собирать документы за 9–12 месяцев.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm">
              <CheckCircle2 className="w-4 h-4 text-slate-700" />
              <span>2. Баланс тестов: IELTS vs SAT</span>
            </div>
            <p className="leading-relaxed text-slate-600">
              Языковой сертификат (IELTS 6.5+ / TOEFL 90+) — обязательное минимальное требование. SAT обязателен не везде, но для стипендий в США и Сингапуре балл 1450+ существенно повышает шансы на финансирование.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm">
              <FileText className="w-4 h-4 text-slate-700" />
              <span>3. Внеучебная деятельность (Spike vs Well-rounded)</span>
            </div>
            <p className="leading-relaxed text-slate-600">
              Ведущие мировые университеты ценят четкий фокус (spike): 2–3 глубоких проекта по вашей специальности (хакатоны, олимпиады, ресерч) выигрывают у 10 разрозненных активностей.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm">
              <Globe className="w-4 h-4 text-slate-700" />
              <span>4. Финансовая стратегия и гранты</span>
            </div>
            <p className="leading-relaxed text-slate-600">
              Если бюджет до $20k/год, сразу ориентируйтесь на государственные вузы Европы (Германия, Италия с грантами DSU, Венгрия со Stipendium Hungaricum) либо селективные вузы США с need-blind/need-based aid.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-stretch gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm leading-5 text-slate-500">
            Хотите персональный анализ под ваш профиль?
          </span>
          <button
            onClick={() => {
              onClose();
              onStartQuestionnaire();
            }}
            className="min-h-11 w-full rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800 sm:w-auto"
          >
            Пройти анкету
          </button>
        </div>
      </div>
    </div>
  );
};
