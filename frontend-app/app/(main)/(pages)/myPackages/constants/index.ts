import type { PackageStatus } from "../../../../utils/types/api/package.types";

export function formatDate(d: string | null): string {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
  });
}

export const FILTERS: { key: PackageStatus | "all"; label: string }[] = [
  { key: "all", label: "Denak" },
  { key: "assigned", label: "Esleituta" },
  { key: "in_transit", label: "Garraioan" },
  { key: "delivered", label: "Entregatuta" },
  { key: "failed", label: "Huts" },
];

export const TABLE_COLS = [
  "Tracking",
  "Hartzailea",
  "Helbidea",
  "Egoera",
  "Data",
  "",
];

export const STATUS_LABEL: Record<PackageStatus, string> = {
  pending: "Zain",
  assigned: "Esleituta",
  in_transit: "Garraioan",
  delivered: "Entregatuta",
  undelivered: "Entregatu gabe",
  failed: "Huts",
};

export const TOAST_MSG: Record<string, (name: string) => string> = {
  in_transit: (n) => `Entrega hasita · ${n}`,
  delivered: (n) => `Entregatuta · ${n}`,
  failed: (n) => `Huts eginda · ${n}`,
};

export const CONFIRM_LABEL: Record<string, string> = {
  in_transit: "Entrega hasi",
  delivered: "Entrega berretsi",
  failed: "Huts markatu",
};

export const CONFIRM_ICON_BG: Record<string, string> = {
  in_transit: "bg-accent-subtle text-accent-light",
  delivered: "bg-[var(--st-delivered-bg)] text-[var(--st-delivered-fg)]",
  failed: "bg-[var(--st-failed-bg)] text-[var(--st-failed-fg)]",
};
