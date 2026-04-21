import { Icons } from "../../../components/icons";
import type { HistoryStatCardProps, HistoryStatsProps } from "../types";

export function HistoryStats({ stats }: HistoryStatsProps) {
  const cards: HistoryStatCardProps[] = [
    {
      label: "Guztira",
      value: stats.total,
      icon: <Icons.Package size={18} />,
      iconColor: "var(--accent-light)",
      iconBg: "var(--accent-subtle)",
    },
    {
      label: "Entreg.",
      value: stats.delivered,
      icon: <Icons.Check size={18} />,
      iconColor: "var(--st-delivered-fg)",
      iconBg: "var(--st-delivered-bg)",
    },
    {
      label: "Huts",
      value: stats.failed,
      icon: <Icons.AlertCircle size={18} />,
      iconColor: "var(--st-failed-fg)",
      iconBg: "var(--st-failed-bg)",
    },
    {
      label: "Tasa",
      value: `${stats.rate}%`,
      icon: <Icons.TrendingUp size={18} />,
      iconColor: "var(--accent-light)",
      iconBg: "var(--accent-subtle)",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  iconColor,
  iconBg,
}: HistoryStatCardProps) {
  return (
    <div className="relative flex min-w-0 flex-col gap-2 overflow-hidden rounded-lg border border-border bg-bg-surface p-3 sm:rounded-xl sm:p-4">
      <div className="flex items-start justify-between gap-2">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md sm:h-9 sm:w-9 sm:rounded-lg"
          style={{ background: iconBg, color: iconColor }}
        >
          {icon}
        </div>
      </div>

      <span className="truncate text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
        {value}
      </span>
      <p className="text-xs text-text-secondary leading-tight">{label}</p>
    </div>
  );
}
