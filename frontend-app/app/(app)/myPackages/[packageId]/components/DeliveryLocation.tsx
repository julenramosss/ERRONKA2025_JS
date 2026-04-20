import { Icons } from "../../../../components/icons";
import type { DeliveryLocationProps } from "../types";

export function DeliveryLocation({ pkg }: DeliveryLocationProps) {
  return (
    <div className="bg-bg-surface border border-border rounded-xl overflow-hidden h-fit">
      <div className="px-5 py-4 border-b border-border">
        <div className="text-sm font-semibold text-text-primary">
          Entrega-kokapena
        </div>
      </div>

      {/* Map placeholder */}
      <div
        className="mx-4 mt-4 rounded-lg flex flex-col items-center justify-center gap-3 text-center"
        style={{
          height: 220,
          background: "var(--bg-elevated)",
          border: "1.5px dashed var(--border-normal)",
        }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            background: "var(--accent-subtle)",
            color: "var(--accent-light)",
          }}
        >
          <Icons.MapPin size={20} />
        </div>
        <div>
          <div className="text-sm font-medium text-text-secondary">
            Mapa laster eskuragarri
          </div>
          <div className="text-xs text-text-disabled mt-1">
            Google Maps integrazioa prestatzen
          </div>
        </div>
      </div>

      {/* Address footer */}
      <div className="px-5 py-4 mt-2">
        <div className="text-sm font-semibold text-text-primary mb-0.5">
          {pkg.street}
        </div>
        <div className="text-xs text-text-secondary mb-4">
          {pkg.postal_code} {pkg.city} · {pkg.country}
        </div>
        <button
          disabled
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium border border-border text-text-disabled cursor-not-allowed opacity-50"
        >
          <Icons.Navigation size={14} />
          Maps-en ireki
        </button>
      </div>
    </div>
  );
}
