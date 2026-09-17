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
    tuition: '€4,000–6,000 / год',
    requirements: 'IELTS 6.5+, высокий GPA, вступительный тест по математике',
    satPolicy: 'Не требуется',
    scholarships: 'Доступны стипендии DAAD и государственная поддержка',
    officialUrl: 'https://www.tum.de',
  },
  {
    name: 'University of Amsterdam (UvA)',
    country: 'Нидерланды',
    city: 'Амстердам',
    tuition: '€12,000–16,000 / год',
    requirements: 'IELTS 6.5–7.0, аттестат + 1 курс либо IB/A-Levels',
    satPolicy: 'Test-Optional',
    scholarships: 'Amsterdam Merit Scholarship',
    officialUrl: 'https://www.uva.nl',
  },
  {
    name: 'Bocconi University',
    country: 'Италия',
    city: 'Милан',
    tuition: '€14,000 / год',
    requirements: 'IELTS 6.5+, Bocconi Test или SAT (1350+), GPA',
    satPolicy: 'SAT принимается взамен внутреннего теста',
    scholarships: 'Need-based aid & 100% Merit Awards',
    officialUrl: 'https://www.unibocconi.eu',
  },
  {
    name: 'KAIST',
    country: 'Южная Корея',
    city: 'Тэджон',
    tuition: 'Полный грант (100% покрытие + стипендия)',
    requirements: 'IELTS 6.5+, SAT/ACT рекомендован, олимпиады по STEM',
    satPolicy: 'Рекомендован для международных кандидатов',
    scholarships: 'KAIST International Student Scholarship (100% tuition + allowance)',
    officialUrl: 'https://www.kaist.ac.kr',
  },
  {
    name: 'Purdue University',
    country: 'США',
    city: 'Уэст-Лафайетт',
    tuition: '$31,104 / год',
    requirements: 'IELTS 6.5–7.0 / TOEFL 88+, SAT Test-Required',
    satPolicy: 'Обязателен (средний балл 1400–1520)',
    scholarships: 'Ограниченные merit стипендии для иностранцев',
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
            Каталог программ
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-slate-950 mt-1">
            Верифицированная база университетов
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Все требования, дедлайны и стоимость проверены по официальным первоисточникам. Никаких выдуманных данных.
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

              <div className="grid grid-cols-1 gap-2 pt-1 text-sm sm:grid-cols-2">
                <div>
                  <span className="text-slate-500 font-medium">Обучение: </span>
                  <span className="text-slate-900 font-semibold">{uni.tuition}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Политика SAT: </span>
                  <span className="text-slate-800">{uni.satPolicy}</span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-100 bg-white p-3 text-sm leading-6 text-slate-600">
                <span className="font-semibold text-slate-700">Входные требования: </span>
                {uni.requirements}
              </div>

              <div className="flex flex-col items-start justify-between gap-3 pt-1 text-sm sm:flex-row sm:items-center">
                <span className="leading-5 text-slate-500">
                  Стипендии: {uni.scholarships}
                </span>
                <a
                  href={uni.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-slate-700 hover:text-black font-medium underline underline-offset-2"
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
            Заполните анкету, чтобы сервис подобрал вузы именно под ваш бюджет и оценки:
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
