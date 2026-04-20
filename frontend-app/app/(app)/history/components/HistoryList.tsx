"use client";

import { useState } from "react";
import Link from "next/link";
import { Icons } from "../../../components/icons";
import { StatusBadge } from "../../components/StatusBadge";
import type {
  HistoryDaySectionProps,
  HistoryListProps,
  HistoryListRowProps,
} from "../types";

export function HistoryList({ groups, total }: HistoryListProps) {
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>(
    {}
  );

  function toggleGroup(dateKey: string) {
    setCollapsedGroups((current) => ({
      ...current,
      [dateKey]: !current[dateKey],
    }));
  }

  return (
    <div className="bg-bg-surface border border-border rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex justify-between items-center gap-3">
        <p className="text-sm font-semibold text-text-primary">
          Pakete historikoak
        </p>
        <span className="text-xs text-text-secondary shrink-0">
          {total} emaitza
        </span>
      </div>

      {groups.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-text-disabled">
          <Icons.Package size={32} />
          <div className="text-center">
            <p className="text-sm font-medium text-text-secondary">
              Emaitzarik ez
            </p>
            <p className="text-xs text-text-disabled mt-1">
              Saiatu beste bilaketa batekin edo aldatu iragazkia
            </p>
          </div>
        </div>
      ) : (
        groups.map((group, index) => (
          <DaySection
            key={group.dateKey}
            group={group}
            collapsed={Boolean(collapsedGroups[group.dateKey])}
            isFirst={index === 0}
            onToggle={() => toggleGroup(group.dateKey)}
          />
        ))
      )}
    </div>
  );
}

function DaySection({
  group,
  collapsed,
  isFirst,
  onToggle,
}: HistoryDaySectionProps) {
  return (
    <div>
      <button
        onClick={onToggle}
        className={`w-full px-4 sm:px-5 py-3 bg-bg-elevated flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 transition-colors hover:bg-[rgba(124,58,237,0.04)] text-left ${
          isFirst ? "" : "border-t border-border"
        } border-b border-border`}
      >
        <span className="flex items-center gap-2 text-xs font-semibold text-text-secondary uppercase tracking-[0.18em]">
          <Icons.ChevronDown
            size={14}
            className={`text-accent-light transition-transform duration-200 ${
              collapsed ? "-rotate-90" : ""
            }`}
          />
          {group.dateLabel}
        </span>
        <span className="text-xs text-text-disabled tracking-wide normal-case">
          {group.summary}
        </span>
      </button>

      {!collapsed && (
        <div>
          {group.items.map((item, index) => (
            <HistoryRow
              key={item.id}
              item={item}
              isLast={index === group.items.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function HistoryRow({ item, isLast }: HistoryListRowProps) {
  return (
    <Link
      href={item.href}
      className={`block px-4 sm:px-5 py-4 transition-colors hover:bg-[rgba(124,58,237,0.05)] ${
        isLast ? "" : "border-b border-border"
      }`}
    >
      <div className="md:hidden">
        <div className="flex items-start justify-between gap-3">
          <span className="font-mono text-[11px] text-accent-light bg-accent-subtle px-2 py-1 rounded-md">
            {item.trackingCode}
          </span>
          <Icons.ChevronRight
            size={14}
            className="text-text-disabled shrink-0 mt-1"
          />
        </div>

        <div className="mt-3 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-accent-subtle border border-border-focus text-accent-light flex items-center justify-center text-xs font-bold shrink-0">
            {item.initial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-text-primary truncate">
              {item.recipientName}
            </p>
            <p className="text-xs text-text-secondary truncate mt-0.5">
              {item.city}, {item.country}
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <StatusBadge status={item.status} />
          <span className="font-mono text-xs text-text-disabled">
            {item.timeLabel}
          </span>
        </div>
      </div>

      <div className="hidden md:grid md:grid-cols-[auto_auto_minmax(0,1fr)_auto_auto_auto] md:items-center md:gap-4">
        <span className="flex items-center h-7 px-2.5 rounded-md bg-bg-elevated border border-border text-xs font-mono text-accent-light shrink-0">
          {item.trackingCode}
        </span>

        <div className="w-8 h-8 rounded-full bg-accent-subtle border border-border-focus text-accent-light flex items-center justify-center text-xs font-bold shrink-0">
          {item.initial}
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-text-primary truncate">
            {item.recipientName}
          </p>
          <p className="text-xs text-text-secondary mt-0.5 truncate">
            {item.city}, {item.country}
          </p>
        </div>

        <StatusBadge status={item.status} />

        <span className="text-xs text-text-secondary font-mono min-w-11 text-right shrink-0">
          {item.timeLabel}
        </span>

        <Icons.ChevronRight
          size={14}
          className="text-text-disabled shrink-0"
        />
      </div>
    </Link>
  );
}
