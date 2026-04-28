'use client';

import { useMemo, useState } from 'react';
import { usePreferences } from '../../../../hooks/usePreferences';
import { useMyPackages } from '../../../../hooks/packages/useMyPackages';
import type { PackageWithAddress } from '../../../../utils/types/api/package.types';
import {
  formatCompactDate,
  formatDayLabel,
  formatDayMonth,
  formatPeriodLabel,
  formatTime,
  toDateKey,
} from '../../../../utils/date.utils';
import {
  formatCompactGroupSummary,
  formatGroupSummary,
  getRecipientInitial,
  HISTORY_FILTERS,
} from '../constants';
import type {
  HistoryChartBar,
  HistoryDayGroup,
  HistoryFinalStatus,
  HistoryFilterOption,
  HistoryFilterStatus,
  HistoryListItem,
  HistoryPeriod,
  HistoryStats,
} from '../types';

const HISTORY_STATUSES = new Set<HistoryFinalStatus>(['delivered', 'failed']);
type HistoryPackage = PackageWithAddress & { status: HistoryFinalStatus };

function isHistoryFinalStatus(
  status: PackageWithAddress['status']
): status is HistoryFinalStatus {
  return HISTORY_STATUSES.has(status as HistoryFinalStatus);
}

export function useHistoryPage() {
  const { data: packagesData, isLoading } = useMyPackages();
  const { dateFormat } = usePreferences();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<HistoryFilterStatus>('all');

  const allHistory = useMemo<HistoryPackage[]>(
    () =>
      [...(packagesData ?? [])]
        .filter((pkg): pkg is HistoryPackage =>
          isHistoryFinalStatus(pkg.status)
        )
        .sort(
          (a, b) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        ),
    [packagesData]
  );

  const stats = useMemo<HistoryStats>(() => {
    const total = allHistory.length;
    const delivered = allHistory.filter(
      (pkg) => pkg.status === 'delivered'
    ).length;
    const failed = allHistory.filter((pkg) => pkg.status === 'failed').length;
    const rate = total > 0 ? Math.round((delivered / total) * 100) : 0;

    return { total, delivered, failed, rate };
  }, [allHistory, dateFormat]);

  const filters = useMemo<HistoryFilterOption[]>(
    () =>
      HISTORY_FILTERS.map(({ key, label }) => ({
        key,
        label,
        count:
          key === 'all'
            ? stats.total
            : key === 'delivered'
              ? stats.delivered
              : stats.failed,
      })),
    [stats]
  );

  const period = useMemo<HistoryPeriod>(() => {
    if (allHistory.length === 0) {
      return {
        start: null,
        end: null,
        label: 'Ez dago daturik',
      };
    }

    const oldest = allHistory[allHistory.length - 1];
    const latest = allHistory[0];

    return {
      start: oldest.updated_at,
      end: latest.updated_at,
      label: formatPeriodLabel(oldest.updated_at, latest.updated_at),
    };
  }, [allHistory, dateFormat]);

  const filtered = useMemo<HistoryPackage[]>(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return allHistory.filter((pkg) => {
      if (filter !== 'all' && pkg.status !== filter) return false;
      if (!normalizedQuery) return true;

      return (
        pkg.recipient_name.toLowerCase().includes(normalizedQuery) ||
        pkg.tracking_code.toLowerCase().includes(normalizedQuery) ||
        pkg.city.toLowerCase().includes(normalizedQuery) ||
        pkg.country.toLowerCase().includes(normalizedQuery) ||
        pkg.id.toString() === normalizedQuery
      );
    });
  }, [allHistory, filter, query]);

  const dayGroups = useMemo<HistoryDayGroup[]>(() => {
    const map = new Map<string, HistoryPackage[]>();

    for (const pkg of filtered) {
      const key = toDateKey(pkg.updated_at);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(pkg);
    }

    return Array.from(map.entries()).map(([dateKey, items]) => {
      const delivered = items.filter(
        (item) => item.status === 'delivered'
      ).length;
      const failed = items.filter((item) => item.status === 'failed').length;

      return {
        dateKey,
        dateLabel: formatDayLabel(items[0].updated_at),
        compactDateLabel: formatCompactDate(items[0].updated_at),
        summary: formatGroupSummary(items.length, delivered),
        compactSummary: formatCompactGroupSummary(items.length, delivered),
        delivered,
        failed,
        total: items.length,
        items: items.map<HistoryListItem>((pkg) => ({
          id: pkg.id,
          href: `/myPackages/${pkg.id}`,
          trackingCode: pkg.tracking_code,
          recipientName: pkg.recipient_name,
          city: pkg.city,
          country: pkg.country,
          status: pkg.status,
          updatedAt: pkg.updated_at,
          timeLabel: formatTime(pkg.updated_at),
          initial: getRecipientInitial(pkg.recipient_name),
        })),
      };
    });
  }, [dateFormat, filtered]);

  const chartBars = useMemo<HistoryChartBar[]>(() => {
    const map = new Map<
      string,
      {
        date: string;
        delivered: number;
        failed: number;
      }
    >();

    const ascendingHistory = [...allHistory].sort(
      (a, b) =>
        new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()
    );

    for (const pkg of ascendingHistory) {
      const key = toDateKey(pkg.updated_at);

      if (!map.has(key)) {
        map.set(key, {
          date: pkg.updated_at,
          delivered: 0,
          failed: 0,
        });
      }

      const current = map.get(key)!;

      if (pkg.status === 'delivered') current.delivered += 1;
      if (pkg.status === 'failed') current.failed += 1;
    }

    return Array.from(map.entries())
      .slice(-14)
      .map(([dateKey, item]) => ({
        dateKey,
        shortLabel: formatDayMonth(item.date),
        fullLabel: formatDayLabel(item.date),
        delivered: item.delivered,
        failed: item.failed,
        total: item.delivered + item.failed,
      }));
  }, [allHistory, dateFormat]);

  return {
    dayGroups,
    chartBars,
    stats,
    filters,
    period,
    query,
    setQuery,
    filter,
    setFilter,
    isLoading,
    totalFiltered: filtered.length,
  };
}
