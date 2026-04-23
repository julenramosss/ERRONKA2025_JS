import { HereMap } from "../../../components/Here/HereMap";
import { useRouteMapPanel } from "../hooks/useRouteMapPanel";
import type { RouteMapPanelProps } from "../types";

export function RouteMapPanel({ selectedStopId }: RouteMapPanelProps) {
  const { selectedStop, activeStop } = useRouteMapPanel(selectedStopId);

  const center = selectedStop?.package.address ?? activeStop?.package.address;

  return (
    <div className="tour-route-map-panel overflow-hidden rounded-xl border border-border bg-bg-surface">
      <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold">Mapa</p>
          <p className="mt-0.5 truncate text-xs text-text-secondary">
            {selectedStop
              ? `${selectedStop.package.address.street}, ${selectedStop.package.address.city}`
              : "Geldialdirik gabe"}
          </p>
        </div>
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
