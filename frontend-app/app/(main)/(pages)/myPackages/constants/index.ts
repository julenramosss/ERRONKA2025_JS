export function formatDate(d: string | null): string {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
  });
}

export const TABLE_COLS = [
  "Tracking",
  "Hartzailea",
  "Helbidea",
  "Egoera",
  "Data",
  "",
];

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
