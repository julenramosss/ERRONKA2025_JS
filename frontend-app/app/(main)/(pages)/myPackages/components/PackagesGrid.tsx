import Link from "next/link";
import { Icons } from "../../../../components/icons";
import { formatDate } from "../constants";
import type { PackagesGridProps } from "../types";
import { StatusBadge } from "../../../components/StatusBadge";

export function PackagesGrid({ packages }: PackagesGridProps) {
  if (packages.length === 0) {
    return (
      <div className="bg-bg-surface border border-border rounded-xl flex flex-col items-center justify-center py-16 gap-3 text-text-disabled">
        <Icons.Package size={32} />
        <p className="text-sm">Ez da paketerik aurkitu</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
      {packages.map((pkg) => (
        <div
          key={pkg.id}
          className="bg-bg-surface border border-border rounded-xl p-5 flex flex-col gap-4 hover:border-border-focus transition-colors"
        >
          {/* Top row */}
          <div className="flex items-start justify-between gap-2">
            <span className="font-mono text-xs text-accent-light bg-accent-subtle px-2 py-1 rounded">
              {pkg.tracking_code}
            </span>
            <StatusBadge status={pkg.status} />
          </div>

          {/* Recipient */}
          <div>
            <p className="text-sm font-semibold">{pkg.recipient_name}</p>
            <div className="flex items-start gap-1.5 mt-1 text-xs text-text-secondary">
              <Icons.MapPin
                size={12}
                className="mt-0.5 shrink-0 text-text-disabled"
              />
              <span className="leading-tight">
                {pkg.street}, {pkg.city}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
            <div className="flex items-center gap-1.5 text-xs text-text-disabled">
              <Icons.Clock size={12} />
              <span className="font-mono">
                {formatDate(pkg.estimated_delivery)}
              </span>
            </div>
            <Link
              href={`/myPackages/${pkg.id}`}
              className="flex items-center gap-1 text-xs font-semibold text-accent-light hover:text-white border border-border-focus hover:bg-accent px-2.5 py-1.5 rounded transition-colors"
            >
              <Icons.Eye size={12} />
              Ikusi gehiago
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
