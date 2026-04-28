'use client';
import { Icons } from '../../../../components/icons';
import { CONFIRM_ICON_BG, CONFIRM_LABEL } from '../constants';
import type { ConfirmModalProps } from '../types';

const CONFIRM_BTN_CLASS: Record<string, string> = {
  in_transit: 'bg-accent hover:bg-accent-hover text-white',
  delivered:
    'bg-[var(--st-delivered-bg)] text-[var(--st-delivered-fg)] border border-[var(--st-delivered-fg)] hover:opacity-90',
  failed:
    'bg-[var(--st-failed-bg)] text-[var(--st-failed-fg)] border border-[var(--st-failed-fg)] hover:opacity-90',
};

export function ConfirmModal({
  pkg,
  to,
  isPending,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  const label = CONFIRM_LABEL[to];
  const btnClass = CONFIRM_BTN_CLASS[to];
  const iconBg = CONFIRM_ICON_BG[to];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-bg-surface border border-border rounded-2xl p-5 sm:p-6 w-full max-w-md shadow-2xl mx-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="flex flex-col items-center text-center gap-3 mb-5">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center ${iconBg}`}
          >
            {to === 'in_transit' && <Icons.Truck size={22} />}
            {to === 'delivered' && <Icons.Check size={22} />}
            {to === 'failed' && <Icons.AlertCircle size={22} />}
          </div>
          <div>
            <h3 className="text-lg font-bold">{label}</h3>
            <p className="text-sm text-text-secondary mt-1">
              {to === 'delivered' &&
                `${pkg.recipient_name}-ri entrega berrestea?`}
              {to === 'in_transit' &&
                `${pkg.recipient_name}-ri entrega hasten ari zara.`}
              {to === 'failed' && 'Paketeak ezin du entregatu izan.'}
            </p>
          </div>
        </div>

        {/* Package info */}
        <div className="bg-bg-elevated border border-border rounded-xl p-4 mb-5 text-sm flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-accent-light bg-accent-subtle px-2 py-0.5 rounded">
              {pkg.tracking_code}
            </span>
          </div>
          <p className="text-text-secondary">
            {pkg.street}, {pkg.city}
          </p>
          <p className="text-text-disabled text-xs">
            {pkg.weight_kg} kg · {pkg.description ?? 'Deskripziorik gabe'}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isPending}
            className="flex-1 py-2.5 rounded-lg border border-border text-sm font-semibold text-text-secondary hover:bg-bg-elevated transition-colors cursor-pointer disabled:opacity-50"
          >
            Utzi
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50 ${btnClass}`}
          >
            {isPending ? (
              <Icons.Loader size={16} className="animate-spin" />
            ) : (
              label
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
