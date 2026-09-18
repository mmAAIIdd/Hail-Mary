import React, { useState } from 'react';
import { RotateCcw, Menu, X } from 'lucide-react';
import { UserProfile } from '../../types/profile';

interface HeaderProps {
  activeTab: 'landing' | 'profile' | 'diagnosis' | 'planner';
  setActiveTab: (tab: 'landing' | 'profile' | 'diagnosis' | 'planner') => void;
  profile: UserProfile | null;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  profile,
  onReset,
}) => {
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

            <nav className="hidden items-center gap-5 md:flex" aria-label="Основная навигация">
              <button
                onClick={() => setActiveTab('landing')}
                aria-current={activeTab === 'landing' ? 'page' : undefined}
                className={activeTab === 'landing' ? 'border-b-2 border-slate-950 py-2 text-sm font-semibold text-slate-950' : 'py-2 text-sm text-slate-600 hover:text-black'}
              >
                Главная
              </button>
              <button
                onClick={handleStartQuestionnaire}
                aria-current={activeTab === 'profile' ? 'page' : undefined}
                className={activeTab === 'profile' ? 'border-b-2 border-slate-950 py-2 text-sm font-semibold text-slate-950' : 'py-2 text-sm text-slate-600 hover:text-black'}
              >
                Анкета
              </button>
              {profile && (
                <button
                  onClick={() => setActiveTab('diagnosis')}
                  aria-current={activeTab === 'diagnosis' ? 'page' : undefined}
                  className={activeTab === 'diagnosis' ? 'border-b-2 border-slate-950 py-2 text-sm font-semibold text-slate-950' : 'py-2 text-sm text-slate-600 hover:text-black'}
                >
                  Рекомендации
                </button>
              )}
              {profile && (
                <button
                  onClick={() => setActiveTab('planner')}
                  aria-current={activeTab === 'planner' ? 'page' : undefined}
                  className={activeTab === 'planner' ? 'border-b-2 border-slate-950 py-2 text-sm font-semibold text-slate-950' : 'py-2 text-sm text-slate-600 hover:text-black'}
                >
                  Мои университеты
                </button>
              )}
            </nav>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              {activeTab === 'landing' && (
                <button
                  onClick={profile ? () => setActiveTab('diagnosis') : handleStartQuestionnaire}
                  className="hidden min-h-10 items-center rounded-xl bg-black px-4 text-xs font-semibold text-white transition hover:bg-neutral-800 sm:inline-flex sm:text-sm"
                >
                  {profile ? 'Мои рекомендации' : 'Пройти анкету'}
                </button>
              )}

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
                  setActiveTab('landing');
                }}
                aria-current={activeTab === 'landing' ? 'page' : undefined}
                className="min-h-11 rounded-lg px-3 text-left hover:bg-white"
              >
                Главная {activeTab === 'landing' && '•'}
              </button>
              <button
                onClick={handleStartQuestionnaire}
                aria-current={activeTab === 'profile' ? 'page' : undefined}
                className="min-h-11 rounded-lg px-3 text-left hover:bg-white"
              >
                Анкета {activeTab === 'profile' && '•'}
              </button>
              {profile && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setActiveTab('diagnosis');
                  }}
                  aria-current={activeTab === 'diagnosis' ? 'page' : undefined}
                  className="min-h-11 rounded-lg px-3 text-left hover:bg-white"
                >
                  Рекомендации {activeTab === 'diagnosis' && '•'}
                </button>
              )}
              {profile && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setActiveTab('planner');
                  }}
                  aria-current={activeTab === 'planner' ? 'page' : undefined}
                  className="min-h-11 rounded-lg px-3 text-left hover:bg-white"
                >
                  Мои университеты {activeTab === 'planner' && '•'}
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

    </>
  );
};
