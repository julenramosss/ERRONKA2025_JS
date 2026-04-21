import type { ApiDateString, ApiDateTimeString } from "./common.types";

export type PackageStatus =
  | "pending"
  | "assigned"
  | "in_transit"
  | "delivered"
  | "failed";

export interface PackageWithAddress {
  id: number;
  tracking_code: string;
  recipient_name: string;
  recipient_email: string;
  weight_kg: number;
  description: string | null;
  status: PackageStatus;
  estimated_delivery: ApiDateString | null;
  address_id: number;
  assigned_to: number | null;
  created_by: number;
  created_at: ApiDateTimeString;
  updated_at: ApiDateTimeString;
  street: string;
  city: string;
  postal_code: string;
  latitude: number;
  longitude: number;
  country: string;
}

export interface UpdatePackageStatusRequest {
  package_id: number;
  new_status: PackageStatus;
}

export type GetMyPackagesResponse = PackageWithAddress[];
export type GetPackageByIdResponse = PackageWithAddress;
export type UpdatePackageStatusResponse = PackageWithAddress;
