'use client';
import { useRef } from 'react';
import { Icons } from '../../../components/icons';
import { useSearchMobile } from './useSearchMobile';

export function SearchMobile() {
  const { isOpen, onClickOpen, onClickClose } = useSearchMobile();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleOpen() {
    onClickOpen();
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  return (
    <>
      {/* Botón icono lupa — solo móvil */}
      <button
        className="sm:hidden p-2 text-text-secondary hover:text-text-primary cursor-pointer"
        onClick={handleOpen}
        aria-label="Buscar"
      >
        <Icons.Search size={20} />
      </button>

      {/* Overlay con blur */}
      <div
        className={`sm:hidden fixed inset-0 z-40 transition-all duration-200 ${
          isOpen
            ? 'backdrop-blur-sm bg-black/30 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClickClose}
      />

      {/* Input flotante animado */}
      <div
        className={`sm:hidden fixed left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 transition-all duration-200 ${
          isOpen
            ? 'top-25 opacity-100 translate-y-0'
            : 'top-15 opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-3 bg-bg-surface px-4 py-2 rounded-md border border-border focus-within:border-accent focus-within:ring-1 focus-within:ring-accent shadow-xl transition-colors">
          <Icons.Search size={17} className="text-text-secondary shrink-0" />
          <input
            ref={inputRef}
            type="text"
            name="search-mobile"
            autoComplete="off"
            maxLength={200}
            className="w-full bg-transparent py-1.5 focus:outline-none text-white placeholder:text-text-secondary text-sm"
            placeholder="Bilatu pakete bat..."
          />
          <button
            onClick={onClickClose}
            className="text-text-secondary hover:text-text-primary shrink-0 cursor-pointer"
            aria-label="Cerrar búsqueda"
          >
            <Icons.X size={16} />
          </button>
        </div>
      </div>
    </>
  );
}
