import { PackageStatus } from "@/app/types";
import type { PackageWithAddress } from "../types";

export type { PackageWithAddress };

export interface UpdateStatusDto {
  package_id?: number;
  package_ids?: number[];
  new_status: PackageStatus;
}

export interface StatusLogEntry {
  packageId: number;
  oldStatus: PackageStatus;
  newStatus: PackageStatus;
  changedBy: number;
}
