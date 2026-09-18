import React from 'react';
import { ArrowRight, BookOpen, Compass, ExternalLink } from 'lucide-react';

interface InfoViewProps {
  section: 'about' | 'resources';
  onStartQuestionnaire: () => void;
}

const resources = [
  {
    title: 'Официальные сайты университетов',
    description: 'Проверяйте требования, дедлайны и стоимость только на страницах выбранной программы.',
    href: 'https://www.ucas.com/',
  },
  {
    title: 'Подготовка к экзаменам',
    description: 'Соберите календарь подготовки к языковому экзамену и другим тестам заранее.',
    href: 'https://www.ets.org/toefl.html',
  },
  {
    title: 'Финансовая помощь',
    description: 'Изучите условия стипендий и financial aid у каждого университета отдельно.',
    href: 'https://educationusa.state.gov/your-5-steps-us-study/finance-your-studies',
  },
];

export const InfoView: React.FC<InfoViewProps> = ({ section, onStartQuestionnaire }) => {
  const isAbout = section === 'about';

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
          {isAbout ? 'О проекте' : 'Полезные материалы'}
        </p>
        <h1 className="mt-4 font-brand text-4xl font-semibold leading-tight text-slate-950 sm:text-6xl">
          {isAbout ? 'Поступление становится понятнее' : 'Ресурсы для подготовки'}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
          {isAbout
            ? 'Hail Mary помогает школьнику собрать исходные данные, увидеть сильные стороны и получить последовательный план подготовки к зарубежному университету.'
            : 'Собрали базовые направления, с которых удобно начать самостоятельную проверку и подготовку.'}
        </p>
      </div>

      {isAbout ? (
        <section className="mt-12 grid gap-5 border-t border-slate-200 pt-8 sm:grid-cols-3">
          <div>
            <Compass className="h-5 w-5 text-slate-950" aria-hidden="true" />
            <h2 className="mt-4 text-lg font-semibold text-slate-950">Ориентир</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Помогаем превратить общую цель в понятные следующие шаги.</p>
          </div>
          <div>
            <BookOpen className="h-5 w-5 text-slate-950" aria-hidden="true" />
            <h2 className="mt-4 text-lg font-semibold text-slate-950">Честный разбор</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Показываем ограничения анкеты и напоминаем перепроверять меняющиеся условия.</p>
          </div>
          <div>
            <ArrowRight className="h-5 w-5 text-slate-950" aria-hidden="true" />
            <h2 className="mt-4 text-lg font-semibold text-slate-950">Личный маршрут</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Рекомендации учитывают страны, бюджет, сроки и интересы именно вашей анкеты.</p>
          </div>
        </section>
      ) : (
        <section className="mt-12 divide-y divide-slate-200 border-y border-slate-200">
          {resources.map((resource) => (
            <a
              key={resource.title}
              href={resource.href}
              target="_blank"
              rel="noreferrer"
              className="flex items-start justify-between gap-6 py-6 transition hover:bg-white"
            >
              <span>
                <span className="block text-lg font-semibold text-slate-950">{resource.title}</span>
                <span className="mt-2 block max-w-2xl text-sm leading-6 text-slate-600">{resource.description}</span>
              </span>
              <ExternalLink className="mt-1 h-5 w-5 shrink-0 text-slate-500" aria-hidden="true" />
            </a>
          ))}
        </section>
      )}

      <button
        type="button"
        onClick={onStartQuestionnaire}
        className="mt-10 inline-flex min-h-12 items-center gap-2 bg-slate-950 px-6 text-sm font-semibold text-white transition hover:bg-black"
      >
        Пройти анкету <ArrowRight className="h-4 w-4" />
      </button>
    </main>
  );
};
