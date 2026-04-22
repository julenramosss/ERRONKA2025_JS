import { NextDeliveriesProps } from "../types";
import { Icons } from "../../../../components/icons";
import { STATUS_LABEL } from "../../../../utils/types";
import type { PackageStatus } from "../../../../utils/types/api/package.types";
import Link from "next/link";

const STATUS_STYLE: Record<PackageStatus, string> = {
  pending:
    "bg-[var(--st-pending-bg)] text-[var(--st-pending-fg)] border-[var(--st-pending-fg)]",
  assigned:
    "bg-[var(--st-assigned-bg)] text-[var(--st-assigned-fg)] border-[var(--st-assigned-fg)]",
  in_transit:
    "bg-[var(--st-transit-bg)] text-[var(--st-transit-fg)] border-[var(--st-transit-fg)]",
  delivered:
    "bg-[var(--st-delivered-bg)] text-[var(--st-delivered-fg)] border-[var(--st-delivered-fg)]",
  undelivered:
    "bg-[var(--st-undelivered-bg)] text-[var(--st-undelivered-fg)] border-[var(--st-undelivered-fg)]",
  failed:
    "bg-[var(--st-failed-bg)] text-[var(--st-failed-fg)] border-[var(--st-failed-fg)]",
};

export function NextDeliveries({
  packages,
  assignPackage,
  isHrefAvailable,
}: {
  packages: NextDeliveriesProps["packages"];
  assignPackage: (pkg: NextDeliveriesProps["packages"][number]) => void;
  isHrefAvailable: boolean;
}) {
  const pending = packages
    .filter((p) => p.status !== "delivered" && p.status !== "failed")
    .slice(0, 6);

  return (
    <div className="bg-bg-surface border border-border rounded-xl overflow-hidden flex flex-col h-full">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">Hurrengo entregatuak</p>
          <p className="text-xs text-text-secondary mt-0.5">
            Ordenean dauden paketeak
          </p>
        </div>
        <Link
          href="/myPackages"
          className="text-xs text-accent-light hover:text-text-primary flex items-center gap-1 transition-colors"
        >
          Denak ikusi
          <Icons.ArrowRight size={13} />
        </Link>
      </div>

      {pending.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3 text-text-disabled">
          <Icons.Check size={32} />
          <p className="text-sm">Pakete guztiak entregatu dira!</p>
        </div>
      ) : (
        <ul>
          {pending.map((pkg, i) => (
            <li
              key={pkg.id}
              onClick={() => assignPackage(pkg)}
              className={`flex items-center gap-3 hover:bg-bg-elevated transition-colors cursor-pointer ${
                i < pending.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <Link
                // onDoubleClick={}
                href={isHrefAvailable ? `/myPackages/${pkg.id}` : "#"}
                className="flex items-center gap-3 px-5 py-3.5 w-full"
              >
                {/* Stop indicator */}
                <div className="w-8 h-8 rounded-full shrink-0 bg-accent-subtle border border-border-focus text-accent-light flex items-center justify-center font-bold text-xs">
                  {i + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {pkg.recipient_name}
                  </p>
                  <p className="text-xs text-text-secondary truncate mt-0.5">
                    {pkg.street}, {pkg.city}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  {pkg.estimated_delivery && (
                    <span className="text-[11px] text-text-disabled font-mono">
                      {new Date(pkg.estimated_delivery).toLocaleDateString(
                        "es-ES",
                        {
                          day: "2-digit",
                          month: "2-digit",
                        }
                      )}
                    </span>
                  )}
                  <span
                    className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded border ${STATUS_STYLE[pkg.status]}`}
                  >
                    {STATUS_LABEL[pkg.status]}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
