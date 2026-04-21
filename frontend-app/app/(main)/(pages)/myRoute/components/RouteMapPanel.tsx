import { Icons } from "../../../../components/icons";
import { HereMap } from "../../../components/Here/HereMap";
import type { RouteMapPanelProps } from "../types";

export function RouteMapPanel({
  selectedStop,
  activeStop,
  isToday,
  isOpeningNavigation,
  onOpenNavigation,
}: RouteMapPanelProps) {
  const center = selectedStop?.package.address ?? activeStop?.package.address;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-bg-surface">
      <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold">Mapa</p>
          <p className="mt-0.5 truncate text-xs text-text-secondary">
            {selectedStop
              ? `${selectedStop.package.address.street}, ${selectedStop.package.address.city}`
              : "Geldialdirik gabe"}
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenNavigation}
          disabled={!isToday || !activeStop || isOpeningNavigation}
          aria-label="Mapa handitu"
          title="Mapa handitu"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-bg-elevated text-text-primary transition-colors hover:border-border-focus disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isOpeningNavigation ? (
            <Icons.Loader size={17} className="animate-spin" />
          ) : (
            <Icons.Maximize size={17} />
          )}
        </button>
      </div>

      <div className="p-4">
        <HereMap
          center={{
            lat: center?.lat,
            lng: center?.lng,
          }}
          label={
            selectedStop
              ? `Geldialdia ${selectedStop.stop_order} - ${selectedStop.package.recipient_name}`
              : undefined
          }
          height="520px"
        />
      </div>
    </div>
  );
}
