import { Icons } from "../../../../../components/icons";
import { HereMap } from "../../../../components/Here/HereMap";
import type { DeliveryLocationProps } from "../types";

export function DeliveryLocation({ pkg }: DeliveryLocationProps) {
  return (
    <div className="bg-bg-surface border border-border rounded-xl overflow-hidden h-fit">
      <div className="px-5 py-4 border-b border-border">
        <div className="text-sm font-semibold text-text-primary">
          Entrega-kokapena
        </div>
      </div>

      <div className="mx-4 mt-4 rounded-lg overflow-hidden">
        <HereMap
          center={{ lat: pkg.latitude, lng: pkg.longitude }}
          label={`${pkg.street}, ${pkg.city}`}
          height="220px"
        />
      </div>

      <div className="px-5 py-4 mt-2">
        <div className="text-sm font-semibold text-text-primary mb-0.5">
          {pkg.street}
        </div>
        <div className="text-xs text-text-secondary mb-4">
          {pkg.postal_code} {pkg.city} · {pkg.country}
        </div>
        <a
          href={`https://www.google.com/maps?q=${pkg.latitude},${pkg.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium border border-border text-text-secondary hover:text-text-primary hover:border-border-focus transition-colors"
        >
          <Icons.Navigation size={14} />
          Maps-en ireki
        </a>
      </div>
    </div>
  );
}
