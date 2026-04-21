import Link from "next/link";
import { Icons } from "../../../../components/icons";
import { formatDate } from "../constants";
import type { PackageMobileCardProps } from "../types";
import { StatusBadge } from "../../../components/StatusBadge";

export function PackageMobileCard({ pkg }: PackageMobileCardProps) {
  return (
    <div className="bg-bg-surface border border-border rounded-xl p-4 flex flex-col gap-3">
      {/* Tracking + status */}
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-xs text-accent-light bg-accent-subtle px-2 py-1 rounded">
          {pkg.tracking_code}
        </span>
        <StatusBadge status={pkg.status} />
      </div>

      {/* Recipient */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-accent-subtle border border-border-focus text-accent-light flex items-center justify-center text-xs font-bold shrink-0">
          {pkg.recipient_name.slice(0, 1)}
        </div>
        <div>
          <p className="text-sm font-semibold">{pkg.recipient_name}</p>
          <p className="text-xs text-text-disabled">{pkg.weight_kg} kg</p>
        </div>
      </div>

      {/* Address + ETA */}
      <div className="flex items-start justify-between gap-2 text-xs text-text-secondary">
        <div className="flex items-start gap-1.5">
          <Icons.MapPin
            size={12}
            className="mt-0.5 shrink-0 text-text-disabled"
          />
          <span className="leading-tight">
            {pkg.street}, {pkg.city}
          </span>
        </div>
        <div className="flex items-center gap-1 text-text-disabled shrink-0 font-mono">
          <Icons.Clock size={11} />
          {formatDate(pkg.estimated_delivery)}
        </div>
      </div>

      {/* Link */}
      <Link
        href={`/myPackages/${pkg.id}`}
        className="pt-1 border-t border-border flex items-center justify-center gap-1.5 text-xs font-semibold bg-accent hover:bg-accent-hover text-white py-2 rounded transition-colors"
      >
        <Icons.Eye size={13} />
        Ikusi paketea
      </Link>
    </div>
  );
}
