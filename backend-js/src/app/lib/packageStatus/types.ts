import { PackageStatus } from "@/app/types";

export interface PackageStatusChange {
  packageId: number;
  oldStatus: PackageStatus;
  newStatus: PackageStatus;
}

export interface ApplyPackageStatusSideEffectsOptions {
  defaultDistributorId?: number | null;
}
