import { usePreferences } from '../../../../../hooks/usePreferences';
import type { PackageStatus } from '../../../../../utils/types/api/package.types';
import { STATUS_LABEL } from '../../../../../utils/types';
import { formatDateTime } from '../../../../../utils/date.utils';
import { StatusBadge } from '../../../../components/StatusBadge';
import type { PackageStatusHistoryProps } from '../types';

const STATUS_DOT_COLOR: Record<PackageStatus, string> = {
  pending: 'var(--st-pending-fg)',
  assigned: 'var(--st-assigned-fg)',
  in_transit: 'var(--st-transit-fg)',
  delivered: 'var(--st-delivered-fg)',
  undelivered: 'var(--st-undelivered-fg)',
  failed: 'var(--st-failed-fg)',
};

export function PackageStatusHistory({
  logs,
  isLoading,
}: PackageStatusHistoryProps) {
  usePreferences();

  const sorted = [...logs].sort(
    (a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime()
  );

  return (
    <div className="tour-pkg-status-history bg-bg-surface border border-border rounded-xl overflow-hidden">
      <div className="px-5 md:px-6 py-4 border-b border-border">
        <div className="text-sm font-semibold text-text-primary">
          Egoera historia
        </div>
        <div className="text-xs text-text-secondary mt-0.5">
          {isLoading ? 'Kargatzen…' : `${logs.length} aldaketa erregistratu`}
        </div>
      </div>

      <div className="px-5 md:px-8 py-5">
        {isLoading ? (
          <div className="flex flex-col gap-4 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-3 h-3 rounded-full bg-bg-elevated mt-1 shrink-0" />
                <div className="flex-1 flex flex-col gap-1.5">
                  <div className="h-4 w-24 rounded bg-bg-elevated" />
                  <div className="h-3 w-32 rounded bg-bg-elevated" />
                </div>
                <div className="h-3 w-20 rounded bg-bg-elevated" />
              </div>
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <p className="text-xs text-text-disabled text-center py-4">
            Ez dago historiarik
          </p>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div
              className="absolute left-1.25 top-4 bottom-4 w-px"
              style={{ background: 'var(--border-normal)' }}
            />
            <div className="flex flex-col">
              {sorted.map((entry, i) => {
                const isLatest = i === 0;
                const dotColor = STATUS_DOT_COLOR[entry.newStatus];
                return (
                  <div
                    key={entry.id}
                    className="flex items-start gap-4 py-3 relative"
                  >
                    {/* Dot */}
                    <div
                      className="w-3 h-3 rounded-full shrink-0 mt-1 z-10"
                      style={{
                        background: dotColor,
                        boxShadow: isLatest
                          ? `0 0 0 3px var(--bg-surface), 0 0 0 5px ${dotColor}44, 0 0 16px ${dotColor}88`
                          : `0 0 0 2px var(--bg-surface)`,
                      }}
                    />

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <StatusBadge status={entry.newStatus} />
                        {isLatest && (
                          <span className="text-[10px] font-medium text-accent-light">
                            Oraingo egoera
                          </span>
                        )}
                      </div>
                      {entry.oldStatus && (
                        <div className="text-xs text-text-disabled mt-0.5">
                          {STATUS_LABEL[entry.oldStatus]} →{' '}
                          {STATUS_LABEL[entry.newStatus]}
                        </div>
                      )}
                      {entry.notes && (
                        <div className="text-xs text-text-secondary mt-1 italic">
                          {entry.notes}
                        </div>
                      )}
                    </div>

                    {/* Timestamp */}
                    <div className="font-mono text-[10px] text-text-disabled shrink-0 mt-1">
                      {formatDateTime(entry.changedAt)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
