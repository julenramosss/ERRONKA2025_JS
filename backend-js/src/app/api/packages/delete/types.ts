import { PackageStatus } from '@/app/types';

export interface DeletePackageDto {
  id: number;
}

export interface PackageRow {
  id: number;
  status: PackageStatus;
  address_id: number;
}
