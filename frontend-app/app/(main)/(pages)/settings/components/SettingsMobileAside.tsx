'use client';
import { useEffect, useState } from 'react';
import { Icons } from '../../../../components/icons';
import { SETTINGS_ROUTES, SettingsRoute } from '../types';
import { SettingsAside } from './SettingsAside';

const ROUTE_LABELS: Record<SettingsRoute, string> = {
  [SETTINGS_ROUTES.general]: 'Generala',
  [SETTINGS_ROUTES.security]: 'Segurtasuna',
  [SETTINGS_ROUTES.appearance]: 'Itxura',
  [SETTINGS_ROUTES.documentation]: 'Dokumentazioa',
};

export function SettingsMobileAside({
  settingsRoute,
  onClickChangeRoute,
}: {
  settingsRoute: SettingsRoute;
  onClickChangeRoute: (route: SettingsRoute) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleChangeRoute = (route: SettingsRoute) => {
    onClickChangeRoute(route);
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen]);

  return (
    <div className="md:hidden">
      <div className="px-3 sm:px-5">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Konfigurazio-atala aukeratu"
          aria-expanded={isOpen}
          className="w-full flex items-center justify-between gap-3 bg-bg-surface border border-border rounded-lg px-4 py-3 text-text-primary hover:bg-bg-elevated transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-3 min-w-0">
            <span className="shrink-0 w-8 h-8 rounded-md bg-accent-subtle border border-border-focus flex items-center justify-center text-accent-light">
              <Icons.Settings size={16} />
            </span>
            <span className="flex flex-col items-start min-w-0">
              <span className="text-[10px] uppercase tracking-wide text-text-disabled font-semibold">
                Konfigurazioa
              </span>
              <span className="text-sm font-semibold text-text-primary truncate">
                {ROUTE_LABELS[settingsRoute]}
              </span>
            </span>
          </span>
          <Icons.ChevronRight
            size={18}
            className="text-text-secondary shrink-0"
          />
        </button>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 max-w-[85vw] flex flex-col gap-5 bg-bg-surface border-r border-border shadow-xl transition-transform duration-200 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-hidden={!isOpen}
      >
        <header className="w-full py-4 px-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icons.Settings size={18} className="text-text-secondary" />
            <span className="text-text-primary font-semibold">
              Konfigurazioa
            </span>
          </div>
          <button
            type="button"
            className="w-7 h-7 shrink-0 flex items-center justify-center rounded-full hover:bg-accent-subtle transition-colors text-text-secondary hover:text-text-primary cursor-pointer"
            onClick={() => setIsOpen(false)}
            aria-label="Itxi"
          >
            <Icons.X size={18} />
          </button>
        </header>
        <div className="px-3 pb-4 overflow-y-auto">
          <SettingsAside
            settingsRoute={settingsRoute}
            onClickChangeRoute={handleChangeRoute}
            hideTitle
          />
        </div>
      </aside>
    </div>
  );
}
