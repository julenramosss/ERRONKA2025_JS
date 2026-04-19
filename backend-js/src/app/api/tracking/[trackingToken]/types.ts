import { PackageStatus } from "@/app/types";

export interface TrackingResult {
  tracking_code: string;
  recipient_name: string;
  status: PackageStatus;
  estimated_delivery: string | null;
  address: {
    street: string;
    city: string;
    postal_code: string;
  };
  last_update: string | null;
}
