import React from 'react';
import { ArrowRight } from 'lucide-react';

interface LandingViewProps {
  onStartQuestionnaire: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onStartQuestionnaire,
}) => {
  return (
    <section
      className="relative min-h-[calc(100vh-4rem)] min-h-[calc(100svh-4rem)] overflow-hidden bg-slate-950 bg-cover bg-[position:58%_center] sm:min-h-[calc(100vh-5rem)] sm:min-h-[calc(100svh-5rem)] lg:bg-[position:64%_center]"
      style={{
        backgroundImage: `url("${import.meta.env.BASE_URL}university-campus-hero.jpg")`,
      }}
    >
      <div className="absolute inset-0 z-0 bg-slate-950/30" aria-hidden="true" />
      <div
        className="absolute inset-0 z-0 bg-gradient-to-r from-slate-950/95 via-slate-950/68 to-slate-950/10"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 bottom-0 z-0 h-56 bg-gradient-to-t from-slate-950/70 to-transparent"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] min-h-[calc(100svh-4rem)] w-full max-w-7xl items-center px-5 py-10 sm:min-h-[calc(100vh-5rem)] sm:min-h-[calc(100svh-5rem)] sm:px-8 sm:py-20 lg:px-12">
        <div className="w-full max-w-3xl text-white">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/75 sm:text-xs">
            Персональный маршрут поступления
          </p>

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
              className="inline-flex min-h-14 items-center justify-center gap-2.5 rounded-lg bg-white px-7 py-4 text-sm font-semibold text-slate-950 shadow-xl shadow-slate-950/30 transition hover:bg-slate-100 active:scale-[0.99]"
            >
              <span>Пройти анкету</span>
              <ArrowRight className="h-4 w-4" />
            </button>

          </div>

        </div>
      </div>
    </section>
  );
};
