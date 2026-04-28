import { PackageStatus } from '@/app/types';

export interface ListAllLogsDto {
  packageId?: number;
  changedBy?: number;
  fromDate?: string;
  toDate?: string;
  page: number;
  limit: number;
}

export interface ListAllLogsResponce {
  id: number;
  packageId: number;
  changedBy: number;
  oldStatus: PackageStatus;
  newStatus: PackageStatus;
  notes: string | null;
  changedAt: string;
}

export interface ListAllLogsResult {
  logs: ListAllLogsResponce[];
  total: number;
  page: number;
  limit: number;
}
