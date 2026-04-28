'use client';

import { Icons } from '../../../../components/icons';
import {
  useContinueFromPast,
  usePendingPastRoute,
} from '../../../../hooks/routes/usePendingPastRoute';
import { formatDate, normalizeDateKey } from '../../../../utils/date.utils';
import { usePreferences } from '../../../../hooks/usePreferences';
import { getActionErrorMessage } from '../hooks/routeUtils';
import { useState } from 'react';

export function EmptyRouteState() {
  const pendingQuery = usePendingPastRoute();
  const continueMutation = useContinueFromPast();
  const [error, setError] = useState<string | null>(null);
  usePreferences();

  const pending = pendingQuery.data?.pending ?? null;

  async function handleContinue(): Promise<void> {
    setError(null);
    try {
      await continueMutation.mutateAsync();
    } catch (err) {
      setError(getActionErrorMessage(err));
    }
  }

  return (
    <div className="flex min-h-105 flex-col items-center justify-center gap-4 rounded-xl border border-border bg-bg-surface px-6 py-8 text-center text-text-secondary">
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent-subtle text-accent-light">
        <Icons.Route size={26} />
      </div>
      <div>
        <p className="text-base font-semibold text-text-primary">
          Ez dago gaurko ibilbide pendenterik
        </p>
        <p className="mt-1 text-sm">
          Gaur ez daukazu hasteko edo jarraitzeko rutarik.
        </p>
      </div>

      {pendingQuery.isLoading && (
        <p className="text-xs text-text-disabled">
          Aurreko egunetako paketeak begiratzen...
        </p>
      )}

      {pending && (
        <div className="mt-2 flex w-full max-w-md flex-col gap-3 rounded-lg border border-border bg-bg-elevated px-4 py-4 text-left">
          <div className="flex items-start gap-2 text-sm text-text-primary">
            <div className="flex flex-col gap-2">
              <p className="flex items-center justify-start gap-3 font-semibold">
                <Icons.AlertCircle
                  size={16}
                  className="mt-0.5 shrink-0 text-accent-light"
                />
                <span>Aurreko egunetako paketeak entreggatu gabe daude</span>
              </p>
              <p className="mt-1 text-sm text-text-secondary letter-spacing-large text-balance">
                {pending.pending_count} pakete geratu dira entregatu gabe
                {pending.route_count > 1
                  ? ` ${pending.route_count} ibilbidean`
                  : ` ${formatDate(normalizeDateKey(pending.route_date))}eko ibilbidean`}
                . Gaur berriro banatu nahi dituzu?
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleContinue}
            disabled={continueMutation.isPending}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white shadow-[0_0_20px_4px] shadow-accent/30 transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {continueMutation.isPending ? (
              <Icons.Loader size={16} className="animate-spin" />
            ) : (
              <Icons.Navigation size={16} />
            )}
            Ruta hau gaur egin
          </button>
          {error && (
            <p className="flex items-center gap-1.5 text-xs text-text-error">
              <Icons.AlertCircle size={13} />
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
