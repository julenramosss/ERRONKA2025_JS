import { PackageStatus } from '@/app/types';

export interface CreatePackageDto {
  recipient_name: string;
  recipient_email: string;
  assigned_to: number | null;
  created_by: number;
  status: PackageStatus;
  weight_kg: number;
  description?: string;
  estimated_delivery?: string;
}

export interface CreateAddressInfoDto {
  street: string;
  city: string;
  postal_code: string;
  latitude?: number;
  longitude?: number;
}

export interface CreateAddressResult extends CreateAddressInfoDto {
  id: number;
}

export interface CreatedPackageResult extends CreatePackageDto {
  id: number;
  address_id: number;
  tracking_code: string;
}
