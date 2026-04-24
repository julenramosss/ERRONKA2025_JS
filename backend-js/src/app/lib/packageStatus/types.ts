import { PackageStatus } from "@/app/types";

export interface PackageStatusChange {
  packageId: number;
  oldStatus?: PackageStatus | null;
  newStatus: PackageStatus;
}
