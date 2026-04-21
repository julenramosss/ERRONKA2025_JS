import { getDayName } from "../../../utils/constants/date.constants";
import type { HistoryFilterStatus } from "../types";

export const HISTORY_FILTERS: { key: HistoryFilterStatus; label: string }[] = [
  { key: "all", label: "Denak" },
  { key: "delivered", label: "Entregatuta" },
  { key: "failed", label: "Huts" },
];

export function formatDayLabel(dateStr: string): string {
  const date = new Date(dateStr);
  const weekday = date.toLocaleDateString("en-EN", { weekday: "long" });

  return `${getDayName(weekday)}, ${formatCompactDateLabel(dateStr)}`;
}

export function formatCompactDateLabel(dateStr: string): string {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);

  return `${day}/${month}/${year}`;
}

export function formatShortDayLabel(dateStr: string): string {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${day}/${month}`;
}

export function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("en-EN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function toDateKey(dateStr: string): string {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatPeriodDate(dateStr: string): string {
  return formatCompactDateLabel(dateStr);
}

export function formatPeriodLabel(start: string, end: string): string {
  if (toDateKey(start) === toDateKey(end)) {
    return formatPeriodDate(start);
  }

  return `${formatPeriodDate(start)} - ${formatPeriodDate(end)}`;
}

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
  return name.trim().charAt(0).toUpperCase() || "?";
}
