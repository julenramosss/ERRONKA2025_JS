import { PackageStatus } from "@/app/types";
import type { PackageWithAddress } from "../types";

export type { PackageWithAddress };

export interface ListPackagesFilters {
  status?: PackageStatus;
  assigned_to?: number;
  city?: string;
  page: number;
  limit: number;
}

export interface ListPackagesResult {
  packages: PackageWithAddress[];
  total: number;
  page: number;
  limit: number;
}
