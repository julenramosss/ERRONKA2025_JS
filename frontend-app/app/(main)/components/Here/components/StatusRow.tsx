import type { StatusRowProps } from "../types";

export function StatusRow({ icon, children }: StatusRowProps) {
  return (
    <div className="flex items-center gap-3 text-sm font-semibold">
      <span className="text-accent-light">{icon}</span>
      <span>{children}</span>
    </div>
  );
}
