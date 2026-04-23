import { Icons } from "../../../../components/icons";
import type { HistoryFilterChipProps, HistoryHeaderProps } from "../types";

export function HistoryHeader({
  period,
  filters,
  query,
  setQuery,
  filter,
  setFilter,
}: HistoryHeaderProps) {
  return (
    <div className="tour-history-header flex flex-col gap-3 sm:gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
            Historiala
          </h1>
          <p className="mt-1 hidden text-sm text-text-secondary sm:block">
            Amaitutako paketeak eta azken emaitzak
          </p>
        </div>

        <div
          className="tour-history-period inline-flex w-full items-center gap-2 rounded-md border border-border bg-bg-surface px-3 py-2 text-xs text-text-secondary sm:w-auto sm:text-sm"
          title={period.label}
        >
          <Icons.Calendar size={14} className="shrink-0 text-accent-light" />
          <span className="text-text-primary truncate">{period.label}</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="tour-history-search flex items-center gap-2 bg-bg-surface border border-border rounded-md px-3 py-2 focus-within:border-border-focus focus-within:ring-1 focus-within:ring-accent transition-colors">
          <Icons.Search size={15} className="text-text-secondary shrink-0" />
          <input
            type="text"
            autoComplete="off"
            maxLength={100}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Bilatu..."
            className="bg-transparent text-sm text-white placeholder:text-text-secondary focus:outline-none flex-1 min-w-0"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-text-disabled hover:text-text-primary shrink-0"
              aria-label="Garbitu bilaketa"
            >
              <Icons.X size={14} />
            </button>
          )}
        </div>

        <div className="tour-history-filters grid grid-cols-3 gap-2 sm:flex sm:flex-wrap">
          {filters.map((item) => (
            <FilterChip
              key={item.key}
              label={item.label}
              count={item.count}
              active={filter === item.key}
              onClick={() => setFilter(item.key)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function FilterChip({ label, count, active, onClick }: HistoryFilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={`flex min-w-0 items-center justify-center gap-1.5 rounded-md border px-2 py-1.5 text-xs font-semibold transition-colors sm:rounded-full sm:px-3 ${
        active
          ? "bg-accent-subtle border-border-focus text-accent-light"
          : "bg-bg-surface border-border text-text-secondary hover:border-border-focus hover:text-text-primary"
      }`}
    >
      <span className="truncate">{label}</span>
      <span
        className={`text-xs px-1 rounded ${
          active ? "bg-accent text-white" : "bg-bg-elevated text-text-disabled"
        }`}
      >
        {count}
      </span>
    </button>
  );
}
