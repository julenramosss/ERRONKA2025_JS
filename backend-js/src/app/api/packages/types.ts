import { PackageStatus } from "@/app/types";

export interface PackageWithAddress {
  id: number;
  tracking_code: string;
  recipient_name: string;
  recipient_email: string;
  weight_kg: number;
  description: string | null;
  status: PackageStatus;
  estimated_delivery: string | null;
  address_id: number;
  assigned_to: number | null;
  created_by: number;
  created_at: string;
  updated_at: string;
  street: string;
  city: string;
  postal_code: string;
  latitude: number;
  longitude: number;
  country: string;
}
