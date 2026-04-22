import { STATUS_LABEL } from "../(pages)/myPackages/constants";
import type { PackageStatus } from "../../utils/types/api/package.types";

const STATUS_STYLE: Record<PackageStatus, string> = {
  pending:
    "bg-[var(--st-pending-bg)] text-[var(--st-pending-fg)] border-[var(--st-pending-fg)]",
  assigned:
    "bg-[var(--st-assigned-bg)] text-[var(--st-assigned-fg)] border-[var(--st-assigned-fg)]",
  in_transit:
    "bg-[var(--st-transit-bg)] text-[var(--st-transit-fg)] border-[var(--st-transit-fg)]",
  delivered:
    "bg-[var(--st-delivered-bg)] text-[var(--st-delivered-fg)] border-[var(--st-delivered-fg)]",
  undelivered:
    "bg-[var(--st-undelivered-bg)] text-[var(--st-undelivered-fg)] border-[var(--st-undelivered-fg)]",
  failed:
    "bg-[var(--st-failed-bg)] text-[var(--st-failed-fg)] border-[var(--st-failed-fg)]",
};

const STATUS_POINT: Record<PackageStatus, string> = {
  pending: "bg-[var(--st-pending-fg)]",
  assigned: "bg-[var(--st-assigned-fg)]",
  in_transit: "bg-[var(--st-transit-fg)]",
  delivered: "bg-[var(--st-delivered-fg)]",
  undelivered: "bg-[var(--st-undelivered-fg)]",
  failed: "bg-[var(--st-failed-fg)]",
};

export function StatusBadge({ status }: { status: PackageStatus }) {
  return (
    <div className="flex">
      <span
        className={`flex items-center justify-start flex-row gap-2 text-[10px] font-semibold uppercase px-2 py-1 rounded-lg ${STATUS_STYLE[status]}`}
      >
        <span
          className={`p-1 flex items-center justify-center rounded-full ${STATUS_POINT[status]}`}
        ></span>
        <span>{STATUS_LABEL[status]}</span>
      </span>
    </div>
  );
}
