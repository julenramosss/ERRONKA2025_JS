import { connect } from "@/app/config/dbConfig";
import { RowDataPacket } from "mysql2/promise";
import { PackageStatus } from "@/app/types";

export async function fetchDailyCounts(): Promise<
  { status: PackageStatus; count: number }[]
> {
  const db = await connect();
  const [rows] = await db.query<
    (RowDataPacket & { status: PackageStatus; count: number })[]
  >(
    "SELECT status, COUNT(*) as count FROM packages WHERE DATE(created_at) = CURDATE() GROUP BY status"
  );
  return rows;
}
