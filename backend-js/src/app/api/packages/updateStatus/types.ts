import { PackageStatus } from '@/app/types';
import type { PackageWithAddress } from '../types';
import { PackageStatusChange } from '../../../lib/packageStatus/types';

export type { PackageWithAddress };

export interface UpdateStatusDto {
  package_id?: number;
  package_ids?: number[];
  new_status: PackageStatus;
}

export interface StatusLogEntry extends PackageStatusChange {
  changedBy: number;
}
