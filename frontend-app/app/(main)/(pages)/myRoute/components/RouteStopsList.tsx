import { Icons } from '../../../../components/icons';
import type { KeyboardEvent } from 'react';
import { StatusBadge } from '../../../components/StatusBadge';
import { formatStopTime } from '../../../../utils/date.utils';
import { isTerminalPackageStatus } from '../constants';
import { useRouteStopsList } from '../hooks/useRouteStopsList';
import type { RouteStopsListProps } from '../types';
import { RouteStopActions } from './RouteStopActions';
import Link from 'next/link';

export function RouteStopsList({
  selectedStopId,
  onSelectStop,
}: RouteStopsListProps) {
  const {
    stops,
    activeStop,
    routeStatus,
    isUpdatingStop,
    actionError,
    googleMapsRouteUrl,
    markStopStatus,
  } = useRouteStopsList();

  function handleRowKeyDown(
    event: KeyboardEvent<HTMLDivElement>,
    stopId: number
  ): void {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    onSelectStop(stopId);
  }

  return (
    <div className="tour-route-stops-list overflow-hidden rounded-xl border border-border bg-bg-surface">
      <div className="flex justify-between flex-col md:items-center md:flex-row border-b border-border gap-5 px-5 py-4">
        <div>
          <p className="text-sm font-semibold">Geldialdiak</p>
          <p className="mt-0.5 text-xs text-text-secondary">
            Paketeak ordenean kudeatu behar dira
          </p>
        </div>
        <Link
          href={googleMapsRouteUrl}
          target="_blank"
          className="tour-route-google-maps flex items-center gap-2 bg-accent py-2 px-4 text-sm border-border-focus rounded-lg hover:opacity-80"
        >
          <Icons.Route size={14} />
          <span className="text-sm md:text-xs font-semibold">
            GoogleMaps Ireki
          </span>
        </Link>
      </div>

      <div className="max-h-155 overflow-y-auto">
        {stops.map((stop, index) => {
          const isSelected = selectedStopId === stop.id;
          const isActive = activeStop?.id === stop.id;
          const isDone = isTerminalPackageStatus(stop.package.status);

          return (
            <div
              key={stop.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelectStop(stop.id)}
              onKeyDown={(event) => handleRowKeyDown(event, stop.id)}
              className={`flex w-full gap-3 border-b border-border px-5 py-4 text-left transition-colors last:border-b-0 hover:bg-bg-elevated ${
                isSelected ? 'bg-accent-subtle/40' : ''
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                    isDone
                      ? 'border-text-success bg-bg-success text-text-success'
                      : isActive
                        ? 'border-accent bg-accent text-white'
                        : 'border-border bg-bg-elevated text-text-secondary'
                  }`}
                >
                  {isDone ? <Icons.Check size={14} /> : stop.stop_order}
                </span>
                {index < stops.length - 1 && (
                  <span className="h-full min-h-8 w-px bg-border" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-text-primary">
                      {stop.package.recipient_name}
                    </p>
                    <p className="mt-1 flex items-start gap-1.5 text-xs text-text-secondary">
                      <Icons.MapPin
                        size={12}
                        className="mt-0.5 shrink-0 text-text-disabled"
                      />
                      <span className="truncate">
                        {stop.package.address.street},{' '}
                        {stop.package.address.city}
                      </span>
                    </p>
                  </div>
                  <StatusBadge status={stop.package.status} />
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-text-disabled">
                  <span className="inline-flex items-center gap-1.5 font-mono">
                    <Icons.Clock size={12} />
                    ETA {formatStopTime(stop.estimated_arrival)}
                  </span>
                  {stop.actual_arrival && (
                    <span className="font-mono text-text-success">
                      {formatStopTime(stop.actual_arrival)}
                    </span>
                  )}
                  {isActive && !isDone && (
                    <span className="inline-flex items-center gap-1 rounded bg-accent-subtle px-2 py-0.5 font-semibold text-accent-light">
                      <Icons.ArrowRight size={12} />
                      Aktiboa
                    </span>
                  )}
                </div>

                <RouteStopActions
                  stop={stop}
                  isActive={isActive}
                  routeStatus={routeStatus}
                  isUpdatingStop={isUpdatingStop}
                  onMarkStop={markStopStatus}
                />
              </div>
            </div>
          );
        })}
      </div>

      {actionError && (
        <div className="flex items-center gap-2 border-t border-border px-5 py-3 text-sm text-text-error">
          <Icons.AlertCircle size={15} />
          <span>{actionError}</span>
        </div>
      )}
    </div>
  );
}
