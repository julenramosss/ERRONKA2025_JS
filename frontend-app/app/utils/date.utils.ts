import { getDayName, getMonthName } from "./constants/date.constants";
import { getPreferences } from "./preferences";

type DateInput = Date | string | number;

function toDate(value: DateInput): Date {
  return value instanceof Date ? value : new Date(value);
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export function toDateKey(value: DateInput): string {
  const d = toDate(value);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function toLocalDateKey(date: Date = new Date()): string {
  return toDateKey(date);
}

export function normalizeDateKey(value: string): string {
  return value.slice(0, 10);
}

export function formatDayMonth(value: DateInput): string {
  const d = toDate(value);
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}`;
}

export function formatCompactDate(value: DateInput): string {
  const d = toDate(value);
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${String(d.getFullYear()).slice(-2)}`;
}

export function formatShortDate(value: DateInput): string {
  const d = toDate(value);
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
}

export function formatLongDate(value: DateInput): string {
  const d = toDate(value);
  const monthEn = d.toLocaleDateString("en-EN", { month: "long" });
  return `${d.getDate()} ${getMonthName(monthEn)} ${d.getFullYear()}`;
}

export function formatTime(value: DateInput): string {
  const d = toDate(value);
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

export function formatDateTimeShort(value: DateInput): string {
  return `${formatShortDate(value)} ${formatTime(value)}`;
}

export function formatDateTimeLong(value: DateInput): string {
  return `${formatLongDate(value)}, ${formatTime(value)}`;
}

export function formatWeekday(value: DateInput): string {
  const d = toDate(value);
  const weekdayEn = d.toLocaleDateString("en-EN", { weekday: "long" });
  return getDayName(weekdayEn);
}

export function formatDate(value: DateInput): string {
  return getPreferences().dateFormat === "long"
    ? formatLongDate(value)
    : formatShortDate(value);
}

export function formatDateTime(value: DateInput): string {
  return getPreferences().dateFormat === "long"
    ? formatDateTimeLong(value)
    : formatDateTimeShort(value);
}

export function formatDayLabel(value: DateInput): string {
  return `${formatWeekday(value)}, ${formatDate(value)}`;
}

export function formatPeriodLabel(start: DateInput, end: DateInput): string {
  const startKey = toDateKey(start);
  const endKey = toDateKey(end);
  if (startKey === endKey) return formatDate(start);
  return `${formatDate(start)} - ${formatDate(end)}`;
}

export function formatStopTime(value: string | null): string {
  if (!value) return "--:--";
  return value.slice(0, 5);
}
