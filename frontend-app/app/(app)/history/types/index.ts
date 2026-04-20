import type { ReactNode } from "react";
import type { PackageStatus } from "../../../types/api/package.types";

export type HistoryFilterStatus = "all" | "delivered" | "failed";
export type HistoryFinalStatus = Extract<PackageStatus, "delivered" | "failed">;

export interface HistoryStats {
  total: number;
  delivered: number;
  failed: number;
  rate: number;
}

export interface HistoryPeriod {
  start: string | null;
  end: string | null;
  label: string;
}

export interface HistoryFilterOption {
  key: HistoryFilterStatus;
  label: string;
  count: number;
}

export interface HistoryChartBar {
  dateKey: string;
  shortLabel: string;
  fullLabel: string;
  delivered: number;
  failed: number;
  total: number;
}

export interface HistoryListItem {
  id: number;
  href: string;
  trackingCode: string;
  recipientName: string;
  city: string;
  country: string;
  status: HistoryFinalStatus;
  updatedAt: string;
  timeLabel: string;
  initial: string;
}

export interface HistoryDayGroup {
  dateKey: string;
  dateLabel: string;
  summary: string;
  delivered: number;
  failed: number;
  total: number;
  items: HistoryListItem[];
}

export interface HistoryHeaderProps {
  period: HistoryPeriod;
  filters: HistoryFilterOption[];
  query: string;
  setQuery: (q: string) => void;
  filter: HistoryFilterStatus;
  setFilter: (f: HistoryFilterStatus) => void;
}

export interface HistoryFilterChipProps {
  active: boolean;
  label: string;
  count: number;
  onClick: () => void;
}

export interface HistoryStatsProps {
  stats: HistoryStats;
}

export interface HistoryStatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  iconColor: string;
  iconBg: string;
}

export interface HistoryChartProps {
  bars: HistoryChartBar[];
}

export interface HistoryListProps {
  groups: HistoryDayGroup[];
  total: number;
}

export interface HistoryDaySectionProps {
  group: HistoryDayGroup;
  collapsed: boolean;
  isFirst: boolean;
  onToggle: () => void;
}

export interface HistoryListRowProps {
  item: HistoryListItem;
  isLast: boolean;
}
