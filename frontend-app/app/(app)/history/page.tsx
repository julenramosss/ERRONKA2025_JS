"use client";

import { Skeleton } from "boneyard-js/react";
import { useHistoryPage } from "./hooks/useHistoryPage";
import { HistoryHeader } from "./components/HistoryHeader";
import { HistoryStats } from "./components/HistoryStats";
import { HistoryChart } from "./components/HistoryChart";
import { HistoryList } from "./components/HistoryList";
import { HistoryLoader } from "./components/loaders/History.loader";

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
    <Skeleton
      name="history-page"
      loading={isLoading}
      fallback={<HistoryLoader />}
    >
      <div className="py-6 px-4 md:px-8 lg:px-10 flex flex-col gap-6">
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
  );
}
