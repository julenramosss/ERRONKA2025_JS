import { RowDataPacket } from "mysql2";
import { connect } from "@/app/config/dbConfig";

export async function listAllLogsRepo(
  params: string[],
  values: unknown[],
  offset: number,
  limit: number
): Promise<{ rows: RowDataPacket[]; total: number }> {
  const db = await connect();
  const whereClause = params.length > 0 ? `WHERE ${params.join(" AND ")}` : "";

  const [countRows] = await db.query<(RowDataPacket & { total: number })[]>(
    `SELECT COUNT(*) as total FROM package_status_logs ${whereClause}`,
    values
  );
  const total = countRows[0].total;

  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT * FROM package_status_logs ${whereClause} ORDER BY changed_at DESC LIMIT ? OFFSET ?`,
    [...values, limit, offset]
  );

  return { rows, total };
}
