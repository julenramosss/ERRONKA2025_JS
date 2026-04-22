import { PackageStatus } from "@/app/types";
import { fetchDailyCounts } from "../repository/getDailySummary.repo";
import { DailySummaryResult } from "../types";

export async function getDailySummaryService(): Promise<DailySummaryResult> {
  const rows = await fetchDailyCounts();

  const summary: Record<PackageStatus, number> = {
    pending: 0,
    assigned: 0,
    in_transit: 0,
    delivered: 0,
    undelivered: 0,
    failed: 0,
  };

  for (const row of rows) {
    summary[row.status] = Number(row.count);
  }

  const total = Object.values(summary).reduce((a, b) => a + b, 0);
  const date = new Date().toISOString().slice(0, 10);

  return { date, summary, total };
}
