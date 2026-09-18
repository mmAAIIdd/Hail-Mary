import React from 'react';
import { ArrowRight } from 'lucide-react';
import { UniversityMap } from './UniversityMap';

interface LandingViewProps {
  onStartQuestionnaire: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onStartQuestionnaire,
}) => {
  return (
    <>
      <section
        className="landing-hero relative min-h-[calc(100vh-4rem)] min-h-[calc(100svh-4rem)] overflow-hidden bg-slate-950 bg-cover bg-[position:58%_center] sm:min-h-[calc(100vh-5rem)] sm:min-h-[calc(100svh-5rem)] lg:bg-[position:64%_center]"
        style={{
          backgroundImage: `url("${import.meta.env.BASE_URL}university-campus-hero.jpg")`,
        }}
      >
        <div className="absolute inset-0 z-0 bg-slate-950/30" aria-hidden="true" />
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-slate-950/95 via-slate-950/68 to-slate-950/10" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 z-0 h-56 bg-gradient-to-t from-slate-950/70 to-transparent" aria-hidden="true" />

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] min-h-[calc(100svh-4rem)] w-full max-w-7xl items-start px-5 pb-10 pt-20 sm:min-h-[calc(100vh-5rem)] sm:min-h-[calc(100svh-5rem)] sm:items-center sm:px-8 sm:py-20 lg:px-12">
          <div className="w-full max-w-3xl text-white">
          <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/75 sm:text-xs">
            <span className="h-px w-8 bg-white/60" aria-hidden="true" />
            <span>Персональный маршрут поступления</span>
          </div>

          <h1 className="mt-5 max-w-3xl font-brand text-[44px] font-semibold leading-[1.02] tracking-[-0.025em] text-white min-[380px]:text-5xl sm:text-7xl lg:text-[86px]">
            Ваш путь к поступлению
          </h1>

          <p className="mt-7 max-w-xl text-base font-normal leading-7 text-white/90 sm:text-lg sm:leading-8">
            Заполните короткую анкету и получите подбор университетов,
            разбор шансов и план подготовки к поступлению.
          </p>

          <div className="mt-10">
            <button
              onClick={onStartQuestionnaire}
              className="atlas-button inline-flex min-h-14 items-center justify-center gap-2.5 px-7 py-4 text-sm font-semibold text-white active:scale-[0.99]"
            >
              <span>Пройти анкету</span>
              <ArrowRight className="h-4 w-4" />
            </button>

          </div>

          <div className="hero-ledger mt-14 grid max-w-xl grid-cols-3 gap-4 py-4 text-[10px] uppercase tracking-[0.16em] sm:gap-8 sm:text-xs">
            <div><strong className="block text-xl font-semibold tracking-normal sm:text-2xl">01</strong><span>Анкета</span></div>
            <div><strong className="block text-xl font-semibold tracking-normal sm:text-2xl">06</strong><span>Вариантов</span></div>
            <div><strong className="block text-xl font-semibold tracking-normal sm:text-2xl">∞</strong><span>Следующих шагов</span></div>
          </div>

          </div>
        </div>
      </section>
      <UniversityMap />
    </>
  );
};
