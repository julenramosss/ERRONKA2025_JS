import { PackageStatus } from "@/app/types";

export interface DailySummaryResult {
  date: string;
  summary: Record<PackageStatus, number>;
  total: number;
}
