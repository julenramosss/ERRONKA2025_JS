import { Icons } from "../../../../components/icons";
import { useMyDailyRoute } from "../../../../hooks/routes/useMyDailyRoute";

export function NotRouteFound() {
  const { refetch } = useMyDailyRoute();

  return (
    <div className="flex min-h-105 flex-col items-center justify-center gap-4 rounded-xl border border-border bg-bg-surface px-6 text-center">
      <Icons.AlertTriangle size={34} className="text-text-error" />
      <div>
        <p className="font-semibold text-text-primary">
          Ezin izan da ruta kargatu
        </p>
        <p className="mt-1 text-sm text-text-secondary">
          Saiatu berriro datuak eguneratzen.
        </p>
      </div>
      <button
        type="button"
        onClick={() => refetch()}
        className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-text-primary transition-colors hover:border-border-focus"
      >
        <Icons.RefreshCw size={15} />
        Berriro saiatu
      </button>
    </div>
  );
}
