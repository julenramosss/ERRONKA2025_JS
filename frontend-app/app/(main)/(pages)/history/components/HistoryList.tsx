'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Icons } from '../../../../components/icons';
import { StatusBadge } from '../../../components/StatusBadge';
import type {
  HistoryDaySectionProps,
  HistoryListProps,
  HistoryListRowProps,
} from '../types';

export function HistoryList({ groups, total }: HistoryListProps) {
  const [collapsedGroups, setCollapsedGroups] = useState<
    Record<string, boolean>
  >({});

  function toggleGroup(dateKey: string) {
    setCollapsedGroups((current) => ({
      ...current,
      [dateKey]: !current[dateKey],
    }));
  }

  return (
    <div className="tour-history-list overflow-hidden rounded-lg border border-border bg-bg-surface sm:rounded-xl">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5 sm:py-4">
        <p className="text-sm font-semibold text-text-primary">
          Pakete historikoak
        </p>
        <span className="text-xs text-text-secondary shrink-0">
          {total} emaitza
        </span>
      </div>

      {groups.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-12 text-text-disabled sm:py-16">
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
        className={`flex w-full items-center justify-between gap-3 bg-bg-elevated px-4 py-2.5 text-left transition-colors hover:bg-[rgba(124,58,237,0.04)] sm:px-5 sm:py-3 ${
          isFirst ? '' : 'border-t border-border'
        } border-b border-border`}
      >
        <span className="flex min-w-0 items-center gap-2 text-xs font-semibold uppercase text-text-secondary sm:tracking-[0.12em]">
          <Icons.ChevronDown
            size={14}
            className={`text-accent-light transition-transform duration-200 ${
              collapsed ? '-rotate-90' : ''
            }`}
          />
          <span className="truncate sm:hidden">{group.compactDateLabel}</span>
          <span className="hidden truncate sm:inline">{group.dateLabel}</span>
        </span>
        <span className="shrink-0 text-xs normal-case tracking-wide text-text-disabled">
          <span className="sm:hidden">{group.compactSummary}</span>
          <span className="hidden sm:inline">{group.summary}</span>
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
      className={`block px-4 py-3 transition-colors hover:bg-[rgba(124,58,237,0.05)] sm:px-5 sm:py-4 ${
        isLast ? '' : 'border-b border-border'
      }`}
    >
      <div className="md:hidden">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border-focus bg-accent-subtle text-xs font-bold text-accent-light">
              {item.initial}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-text-primary">
                {item.recipientName}
              </p>
              <p className="mt-0.5 truncate text-xs text-text-secondary">
                {item.city}, {item.country}
              </p>
            </div>
          </div>
          <Icons.ChevronRight
            size={14}
            className="text-text-disabled shrink-0 mt-1"
          />
        </div>

        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="truncate rounded bg-accent-subtle px-2 py-1 font-mono text-[10px] text-accent-light">
            {item.trackingCode}
          </span>
          <StatusBadge status={item.status} />
          <span className="shrink-0 font-mono text-xs text-text-disabled">
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

        <Icons.ChevronRight size={14} className="text-text-disabled shrink-0" />
      </div>
    </Link>
  );
}
