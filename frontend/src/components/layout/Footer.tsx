import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-12 w-full border-t border-slate-200/80 bg-white py-7 sm:mt-16 sm:py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 text-center text-sm text-slate-500 sm:flex-row sm:px-6 sm:text-left lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
          <span className="font-brand font-medium text-sm text-slate-900">Hail Mary</span>
          <span>•</span>
          <span>Персональный путь к поступлению</span>
        </div>
        <div className="text-xs text-slate-400">
          Профиль • Диагностика • Следующие шаги
        </div>
      </div>
    </footer>
  );
};
