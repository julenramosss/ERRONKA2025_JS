import { Icons } from "../../../components/icons";
import type { HistoryStatCardProps, HistoryStatsProps } from "../types";

export function HistoryStats({ stats }: HistoryStatsProps) {
  const cards: HistoryStatCardProps[] = [
    {
      label: "Amaitutako paketeak",
      value: stats.total,
      icon: <Icons.Package size={18} />,
      iconColor: "var(--accent-light)",
      iconBg: "var(--accent-subtle)",
    },
    {
      label: "Entregatuta",
      value: stats.delivered,
      icon: <Icons.Check size={18} />,
      iconColor: "var(--st-delivered-fg)",
      iconBg: "var(--st-delivered-bg)",
    },
    {
      label: "Huts eginda",
      value: stats.failed,
      icon: <Icons.AlertCircle size={18} />,
      iconColor: "var(--st-failed-fg)",
      iconBg: "var(--st-failed-bg)",
    },
    {
      label: "Arrakasta tasa",
      value: `${stats.rate}%`,
      icon: <Icons.TrendingUp size={18} />,
      iconColor: "var(--accent-light)",
      iconBg: "var(--accent-subtle)",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
    <div className="bg-bg-surface border border-border rounded-xl p-5 flex flex-col gap-3 relative overflow-hidden">
      <div className="flex items-start justify-between gap-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: iconBg, color: iconColor }}
        >
          {icon}
        </div>
      </div>

      <span className="text-3xl font-bold text-text-primary tracking-tight">
        {value}
      </span>
      <p className="text-xs text-text-secondary leading-tight">{label}</p>
    </div>
  );
}
