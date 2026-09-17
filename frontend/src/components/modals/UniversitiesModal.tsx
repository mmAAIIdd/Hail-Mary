import React from 'react';
import { X, Building2, ExternalLink, MapPin } from 'lucide-react';

interface UniversitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartQuestionnaire: () => void;
}

const SAMPLE_UNIVERSITIES = [
  {
    name: 'Technical University of Munich (TUM)',
    country: 'Германия',
    city: 'Мюнхен',
    officialUrl: 'https://www.tum.de',
  },
  {
    name: 'University of Amsterdam (UvA)',
    country: 'Нидерланды',
    city: 'Амстердам',
    officialUrl: 'https://www.uva.nl',
  },
  {
    name: 'Bocconi University',
    country: 'Италия',
    city: 'Милан',
    officialUrl: 'https://www.unibocconi.eu',
  },
  {
    name: 'KAIST',
    country: 'Южная Корея',
    city: 'Тэджон',
    officialUrl: 'https://www.kaist.ac.kr',
  },
  {
    name: 'Purdue University',
    country: 'США',
    city: 'Уэст-Лафайетт',
    officialUrl: 'https://www.purdue.edu',
  },
];

export const UniversitiesModal: React.FC<UniversitiesModalProps> = ({
  isOpen,
  onClose,
  onStartQuestionnaire,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-4">
      <div className="relative max-h-[94dvh] w-full max-w-3xl overflow-y-auto rounded-t-3xl border border-slate-200 bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl sm:max-h-[90vh] sm:rounded-3xl sm:p-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 sm:right-5 sm:top-5"
          aria-label="Закрыть"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6 pr-11">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Для начала поиска
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-slate-950 mt-1">
            Примеры университетов
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Несколько вариантов из разных стран. Актуальные требования и стоимость всегда проверяйте на официальном сайте.
          </p>
        </div>

        <div className="space-y-3.5">
          {SAMPLE_UNIVERSITIES.map((uni) => (
            <div
              key={uni.name}
              className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-white hover:border-slate-300 transition space-y-2"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-700 shrink-0" />
                  <span className="text-sm font-bold text-slate-900">{uni.name}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{uni.city}, {uni.country}</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2 text-sm">
                <span className="leading-5 text-slate-500">
                  Требования, сроки и стоимость
                </span>
                <a
                  href={uni.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center gap-1 font-semibold text-slate-800 underline underline-offset-2 hover:text-black"
                >
                  <span>Официальный сайт</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-sm leading-6 text-slate-500">
            Заполните анкету, чтобы определить подходящие страны, бюджет и требования.
          </span>
          <button
            onClick={() => {
              onClose();
              onStartQuestionnaire();
            }}
            className="min-h-11 w-full rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 sm:w-auto"
          >
            Пройти анкету
          </button>
        </div>
      </div>
    </div>
  );
};
