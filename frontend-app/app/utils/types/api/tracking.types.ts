import type { ApiDateString, ApiDateTimeString } from './common.types';
import type { PackageStatus } from './package.types';

export interface TrackingAddress {
  street: string;
  city: string;
  postal_code: string;
}

export interface TrackingResponse {
  tracking_code: string;
  recipient_name: string;
  status: PackageStatus;
  estimated_delivery: ApiDateString | null;
  address: TrackingAddress;
  last_update: ApiDateTimeString | null;
}
