import React, { useState } from 'react';
import { RotateCcw, ArrowLeft, ArrowRight, Menu, X } from 'lucide-react';
import { UserProfile } from '../../types/profile';
import { TipsModal } from '../modals/TipsModal';
import { UniversitiesModal } from '../modals/UniversitiesModal';

interface HeaderProps {
  activeTab: 'landing' | 'profile' | 'diagnosis';
  setActiveTab: (tab: 'landing' | 'profile' | 'diagnosis') => void;
  profile: UserProfile | null;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  profile,
  onReset,
}) => {
  const [isTipsOpen, setIsTipsOpen] = useState(false);
  const [isUnisOpen, setIsUnisOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleStartQuestionnaire = () => {
    setIsMobileMenuOpen(false);
    setActiveTab('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className="relative sticky top-0 z-40 w-full border-b border-stone-200/80 bg-[#faf8f5]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-3 sm:h-20">
            {/* Brand */}
            <div className="flex min-w-0 items-center">
              <button
                onClick={() => setActiveTab('landing')}
                className="flex items-center gap-2 text-left group focus:outline-none"
              >
                <span className="whitespace-nowrap font-brand text-xl font-semibold tracking-tight text-slate-950 transition group-hover:text-neutral-700 sm:text-[30px] sm:font-medium">
                  Hail Mary
                </span>
              </button>
            </div>

            {/* Navigation links requested by user: "Советы", "Университеты" */}
            <nav className="hidden items-center space-x-3 md:flex">
              <button
                onClick={() => setIsTipsOpen(true)}
                className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium text-slate-600 hover:text-black hover:bg-slate-100/80 transition"
              >
                Советы
              </button>

              <button
                onClick={() => profile ? setActiveTab('diagnosis') : setIsUnisOpen(true)}
                className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium text-slate-600 hover:text-black hover:bg-slate-100/80 transition"
              >
                Университеты
              </button>

              {activeTab !== 'landing' && (
                <button
                  onClick={() => setActiveTab('landing')}
                  className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium text-slate-500 hover:text-black transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>На главную</span>
                </button>
              )}
            </nav>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              {profile && activeTab === 'landing' && (
                <button
                  onClick={() => setActiveTab('diagnosis')}
                  className="hidden sm:inline-block text-xs font-semibold px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition"
                >
                  Моя диагностика
                </button>
              )}

              {/* Main prominent CTA Button requested: "Пройти анкету" */}
              <button
                onClick={handleStartQuestionnaire}
                className="inline-flex items-center gap-1.5 rounded-xl bg-black px-3.5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-neutral-800 active:scale-[0.98] sm:px-5 sm:text-sm"
              >
                <span className="sm:hidden">Анкета</span>
                <span className="hidden sm:inline">Пройти анкету</span>
                <ArrowRight className="hidden h-3.5 w-3.5 text-slate-400 sm:block" />
              </button>

              {profile && (
                <button
                  onClick={onReset}
                  title="Сбросить профиль"
                  className="hidden rounded-xl border border-transparent p-2 text-slate-400 transition hover:border-rose-100 hover:bg-rose-50 hover:text-rose-600 md:inline-flex"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                type="button"
                aria-label={isMobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
                aria-expanded={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-stone-200 bg-white text-slate-800 md:hidden"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="absolute inset-x-0 top-full border-b border-stone-200 bg-[#faf8f5] shadow-lg md:hidden">
            <nav className="mx-auto grid max-w-7xl gap-1 px-4 py-3 text-sm font-semibold text-slate-800">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsTipsOpen(true);
                }}
                className="min-h-11 rounded-lg px-3 text-left hover:bg-white"
              >
                Советы
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (profile) setActiveTab('diagnosis');
                  else setIsUnisOpen(true);
                }}
                className="min-h-11 rounded-lg px-3 text-left hover:bg-white"
              >
                Университеты
              </button>
              {profile && activeTab !== 'diagnosis' && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setActiveTab('diagnosis');
                  }}
                  className="min-h-11 rounded-lg px-3 text-left hover:bg-white"
                >
                  Моя диагностика
                </button>
              )}
              {activeTab !== 'landing' && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setActiveTab('landing');
                  }}
                  className="min-h-11 rounded-lg px-3 text-left hover:bg-white"
                >
                  На главную
                </button>
              )}
              {profile && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onReset();
                  }}
                  className="mt-1 min-h-11 rounded-lg px-3 text-left text-rose-700 hover:bg-rose-50"
                >
                  Сбросить профиль
                </button>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Modals for Советы & Университеты */}
      <TipsModal
        isOpen={isTipsOpen}
        onClose={() => setIsTipsOpen(false)}
        onStartQuestionnaire={handleStartQuestionnaire}
      />

      <UniversitiesModal
        isOpen={isUnisOpen}
        onClose={() => setIsUnisOpen(false)}
        onStartQuestionnaire={handleStartQuestionnaire}
      />
    </>
  );
};
