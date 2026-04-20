import type { ApiDateTimeString } from "./common.types";
import type { PackageStatus } from "./package.types";

export interface PackageLogEntry {
  id: number;
  packageId: number;
  oldStatus: PackageStatus | null;
  newStatus: PackageStatus;
  changedBy: number;
  notes: string | null;
  changedAt: ApiDateTimeString;
}

export interface PackageLogsRequest {
  packageId: number;
  page?: number;
  limit?: number;
}

export interface PackageLogsResponse {
  logs: PackageLogEntry[];
  total: number;
  page: number;
  limit: number;
}
