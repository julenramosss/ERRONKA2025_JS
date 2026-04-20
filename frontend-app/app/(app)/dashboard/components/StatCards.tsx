import { Icons } from "../../../components/icons";
import type { PackageWithAddress } from "../../../types/api/package.types";

interface StatCardsProps {
  packagesData: PackageWithAddress[];
}

interface StatCardItemProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  iconColor: string;
  iconBg: string;
}

export function StatCards({ packagesData }: StatCardsProps) {
  const delivered = packagesData.filter((p) => p.status === "delivered").length;
  const inTransit = packagesData.filter(
    (p) => p.status === "in_transit"
  ).length;
  const assigned = packagesData.filter((p) => p.status === "assigned").length;
  const failed = packagesData.filter((p) => p.status === "failed").length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCardItem
        label="Gaur esleitutako paketeak"
        value={assigned}
        icon={<Icons.Package size={18} />}
        iconColor="var(--accent-light)"
        iconBg="var(--accent-subtle)"
      />
      <StatCardItem
        label="Gaur entregatutako paketeak"
        value={delivered}
        icon={<Icons.Check size={18} />}
        iconColor="var(--st-delivered-fg)"
        iconBg="var(--st-delivered-bg)"
      />
      <StatCardItem
        label="Garraioan"
        value={inTransit}
        icon={<Icons.Truck size={18} />}
        iconColor="var(--st-transit-fg)"
        iconBg="var(--st-transit-bg)"
      />
      <StatCardItem
        label="Huts egindakoak"
        value={failed}
        icon={<Icons.AlertCircle size={18} />}
        iconColor="var(--st-failed-fg)"
        iconBg="var(--st-failed-bg)"
      />
    </div>
  );
}

function StatCardItem({
  label,
  value,
  icon,
  iconColor,
  iconBg,
}: StatCardItemProps) {
  return (
    <div className="bg-bg-surface border border-border rounded-xl p-5 flex flex-col gap-3 relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: iconBg, color: iconColor }}
        >
          {icon}
        </div>
      </div>
      <div>
        <p className="text-[28px] font-bold leading-none tracking-tight">
          {value}
        </p>
        <p className="text-xs text-text-secondary mt-1.5">{label}</p>
      </div>
    </div>
  );
}
