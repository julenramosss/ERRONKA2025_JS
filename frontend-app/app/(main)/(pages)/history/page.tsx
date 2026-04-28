'use client';

import { Skeleton } from 'boneyard-js/react';
import { useHistoryPage } from './hooks/useHistoryPage';
import { HistoryHeader } from './components/HistoryHeader';
import { HistoryStats } from './components/HistoryStats';
import { HistoryChart } from './components/HistoryChart';
import { HistoryList } from './components/HistoryList';
import { HistoryLoader } from './components/loaders/History.loader';

export default function HistoryPage() {
  const {
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
    totalFiltered,
  } = useHistoryPage();

  return (
    <div>
      <Skeleton
        name="history-page"
        loading={isLoading}
        fallback={<HistoryLoader />}
      >
        <div className="flex flex-col gap-4 px-3 py-4 sm:px-5 md:px-8 md:py-6 lg:px-10">
          <HistoryHeader
            period={period}
            filters={filters}
            query={query}
            setQuery={setQuery}
            filter={filter}
            setFilter={setFilter}
          />

          <HistoryStats stats={stats} />

          <HistoryChart bars={chartBars} />

          <HistoryList groups={dayGroups} total={totalFiltered} />
        </div>
      </Skeleton>
    </div>
  );
}
