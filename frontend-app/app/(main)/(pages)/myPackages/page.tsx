"use client";
import { Skeleton } from "boneyard-js/react";
import { PackagesGrid } from "./components/PackagesGrid";
import { PackagesHeader } from "./components/PackagesHeader";
import { PackagesTable } from "./components/PackagesTable";
import {
  PackagesGridLoader,
  PackagesHeaderLoader,
  PackagesTableLoader,
} from "./components/loaders/Packages.loader";
import { useMyPackagesPage } from "./hooks/useMyPackagesPage";

export default function MyPackagesPage() {
  const {
    filtered,
    counts,
    filter,
    setFilter,
    query,
    setQuery,
    view,
    setView,
    isLoading,
  } = useMyPackagesPage();

  return (
    <div className="py-6 px-4 md:px-8 lg:px-10 flex flex-col gap-6">
      <Skeleton
        name="packages-header"
        loading={isLoading}
        fallback={<PackagesHeaderLoader />}
      >
        <PackagesHeader
          total={counts.all}
          counts={counts}
          filter={filter}
          setFilter={setFilter}
          query={query}
          setQuery={setQuery}
          view={view}
          setView={setView}
        />
      </Skeleton>

      <Skeleton
        name="packages-list"
        loading={isLoading}
        fallback={
          view === "list" ? <PackagesTableLoader /> : <PackagesGridLoader />
        }
      >
        <div className="tour-packages-table">
          {view === "list" ? (
            <PackagesTable packages={filtered} />
          ) : (
            <PackagesGrid packages={filtered} />
          )}
        </div>
      </Skeleton>
    </div>
  );
}
