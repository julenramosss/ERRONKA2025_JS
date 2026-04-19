import { PackageStatus } from "@/app/types";

export interface ListByPackageDto {
  packageId: number;
  page: number;
  limit: number;
}

export interface ListByPackageResult {
  logs: LogEntry[];
  total: number;
  page: number;
  limit: number;
}

export interface LogEntry {
  id: number;
  packageId: number;
  oldStatus: PackageStatus | null;
  newStatus: PackageStatus;
  changedBy: number;
  notes: string | null;
  changedAt: string;
}
