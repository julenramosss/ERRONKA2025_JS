import { Icons } from "../../../../components/icons";

export function EmptyRouteState() {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center gap-3 rounded-xl border border-border bg-bg-surface px-6 text-center text-text-secondary">
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent-subtle text-accent-light">
        <Icons.Route size={26} />
      </div>
      <div>
        <p className="text-base font-semibold text-text-primary">
          Ez dago ibilbiderik
        </p>
        <p className="mt-1 text-sm">
          Momentuz ez dago zuretzat esleitutako rutarik.
        </p>
      </div>
    </div>
  );
}
