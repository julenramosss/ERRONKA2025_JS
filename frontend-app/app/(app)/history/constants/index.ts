import type { HistoryFilterStatus } from "../types";

export const HISTORY_FILTERS: { key: HistoryFilterStatus; label: string }[] = [
  { key: "all", label: "Denak" },
  { key: "delivered", label: "Entregatuta" },
  { key: "failed", label: "Huts" },
];

export function formatDayLabel(dateStr: string): string {
  const label = new Date(dateStr).toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function formatShortDayLabel(dateStr: string): string {
  return new Date(dateStr)
    .toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
    })
    .replaceAll(".", "");
}

export function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("es-ES", {
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
  return new Date(dateStr)
    .toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .replaceAll(".", "");
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

export function getRecipientInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase() || "?";
}
