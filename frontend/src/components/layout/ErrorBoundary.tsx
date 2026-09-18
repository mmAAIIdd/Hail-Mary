import React from 'react';

interface ErrorBoundaryState {
  failed: boolean;
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = { failed: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: Error): void {
    console.error('Не удалось показать страницу', error);
  }

  render(): React.ReactNode {
    if (this.state.failed) {
      return (
        <main className="mx-auto max-w-2xl px-6 py-20 text-slate-900">
          <h1 className="font-brand text-3xl font-semibold">Не удалось показать страницу</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">Ваши ответы сохранены в этом браузере. Обновите страницу и попробуйте снова.</p>
          <button type="button" onClick={() => window.location.reload()} className="mt-6 min-h-11 border-b-2 border-slate-950 text-sm font-semibold">Обновить страницу</button>
        </main>
      );
    }
    return this.props.children;
  }
}
