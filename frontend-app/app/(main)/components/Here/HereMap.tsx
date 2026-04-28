'use client';

import { NoHereMap } from './components/NoHereMap';
import { useHereMap } from './hooks/useHereMap';
import type { HereMapProps } from './types';

export function HereMap({
  reference,
  center,
  label,
  height = '300px',
}: HereMapProps) {
  const { mapRef, loaded, hasValidCoords } = useHereMap({ center });

  if (!hasValidCoords) {
    return <NoHereMap ref={reference} height={height} />;
  }

  if (!loaded) {
    return (
      <div
        ref={reference}
        style={{ width: '100%', height }}
        className="relative overflow-hidden rounded-xl bg-bg-surface animate-pulse"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
              style={{
                borderColor: 'var(--accent-primary)',
                borderTopColor: 'transparent',
              }}
            />
            <span className="text-xs text-text-disabled">
              Mapa kargatzen...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={reference}
      style={{ width: '100%', height }}
      className="relative overflow-hidden rounded-xl"
    >
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
      {label && (
        <div className="flex items-center justify-center">
          <div className="hidden md:block absolute top-1 left-3 right-3 rounded-lg px-3 py-1.5 text-xs font-medium text-text-secondary truncate bg-accent-subtle border-border-focus">
            {label}
          </div>
        </div>
      )}
    </div>
  );
}
