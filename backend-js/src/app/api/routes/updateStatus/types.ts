import { RowDataPacket } from 'mysql2/promise';
import { PackageStatus } from '@/app/types';

export interface UpdateRouteStatusDto {
  routeId: number;
  status: RouteStatus;
}

export interface RouteRow {
  id: number;
  user_id: number;
  status: RouteStatus;
  route_date: string;
}

export const ROUTE_STATUSES = {
  planned: 'planned',
  in_progress: 'in_progress',
  completed: 'completed',
} as const;
export type RouteStatus = (typeof ROUTE_STATUSES)[keyof typeof ROUTE_STATUSES];

export interface PendingStopRow extends RowDataPacket {
  stop_id: number;
  package_id: number;
}

export interface RoutePackageStatusChangeRow extends RowDataPacket {
  id: number;
  old_status: PackageStatus;
}
