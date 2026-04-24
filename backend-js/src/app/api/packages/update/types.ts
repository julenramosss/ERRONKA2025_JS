import { PackageStatus } from "@/app/types";
import type { PackageWithAddress } from "../types";

export type { PackageWithAddress };

export interface UpdatePackageDto {
  recipient_name?: string;
  recipient_email?: string;
  assigned_to?: number | null;
  status?: PackageStatus;
  weight_kg?: number;
  description?: string;
  estimated_delivery?: string;
}

export interface UpdateAddressDto {
  street?: string;
  city?: string;
  postal_code?: string;
  country?: string;
}

export interface UpdatePackageInput {
  id: number;
  packageInfo: UpdatePackageDto;
  addressInfo?: UpdateAddressDto;
}
