"use client";
import { Icons } from "../../../components/icons";
import { FILTERS } from "../constants";
import type { FilterChipProps, PackagesHeaderProps, ViewMode } from "../types";

function FilterChip({ label, count, active, onClick }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${
        active
          ? "bg-accent-subtle border-border-focus text-accent-light"
          : "bg-bg-surface border-border text-text-secondary hover:border-border-focus hover:text-text-primary"
      }`}
    >
      {label}
      <span
        className={`text-[10px] px-1 rounded ${active ? "bg-accent text-white" : "bg-bg-elevated text-text-disabled"}`}
      >
        {count}
      </span>
    </button>
  );
}

export function PackagesHeader({
  total,
  counts,
  filter,
  setFilter,
  query,
  setQuery,
  view,
  setView,
}: PackagesHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Title row */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
            Nire paketeak
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            {total} pakete esleituta gaur
          </p>
        </div>

        {/* View toggle — always visible */}
        <div className="flex gap-0.5 p-1 bg-bg-surface border border-border rounded-md shrink-0 self-start mt-1">
          {(["list", "grid"] as ViewMode[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`w-8 h-8 flex items-center justify-center rounded transition-colors cursor-pointer ${
                view === v
                  ? "bg-accent-subtle text-accent-light"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {v === "list" ? (
                <Icons.List size={16} />
              ) : (
                <Icons.Grid size={16} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Search — full width */}
      <div className="flex items-center gap-2 bg-bg-surface border border-border rounded-md px-3 py-2 focus-within:border-border-focus focus-within:ring-1 focus-within:ring-accent transition-colors">
        <Icons.Search size={15} className="text-text-secondary shrink-0" />
        <input
          type="text"
          autoComplete="off"
          maxLength={100}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Bilatu destinatarioa edo tracking..."
          className="bg-transparent text-sm text-white placeholder:text-text-secondary focus:outline-none flex-1 min-w-0"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="text-text-disabled hover:text-text-primary shrink-0"
          >
            <Icons.X size={14} />
          </button>
        )}
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map(({ key, label }) => (
          <FilterChip
            key={key}
            label={label}
            count={counts[key] ?? 0}
            active={filter === key}
            onClick={() => setFilter(key)}
          />
        ))}
      </div>
    </div>
  );
}
