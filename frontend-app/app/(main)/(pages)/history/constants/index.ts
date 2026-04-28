import type { HistoryFilterStatus } from '../types';

export const HISTORY_FILTERS: { key: HistoryFilterStatus; label: string }[] = [
  { key: 'all', label: 'Denak' },
  { key: 'delivered', label: 'Entregatuta' },
  { key: 'failed', label: 'Huts' },
];

export function formatGroupSummary(total: number, delivered: number): string {
  return `${total} pakete · ${delivered} entregatuta`;
}

export function formatCompactGroupSummary(
  total: number,
  delivered: number
): string {
  return `${total} - ${delivered} ok`;
}

export function getRecipientInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase() || '?';
}
