import { connect } from "@/app/config/dbConfig";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { PackageStatus } from "@/app/types";
import { PackageWithAddress } from "../types";

export async function findPackageById(
  id: number
): Promise<PackageWithAddress | null> {
  const db = await connect();
  const [rows] = await db.query<(RowDataPacket & PackageWithAddress)[]>(
    `SELECT p.*, a.street, a.city, a.postal_code, a.latitude, a.longitude, a.country
     FROM packages p
     JOIN addresses a ON p.address_id = a.id
     WHERE p.id = ?`,
    [id]
  );
  return rows[0] ?? null;
}

export async function updatePackageStatus(
  id: number,
  status: PackageStatus
): Promise<void> {
  const db = await connect();
  await db.query<ResultSetHeader>(
    "UPDATE packages SET status = ? WHERE id = ?",
    [status, id]
  );
}

export async function insertStatusLog(
  packageId: number,
  oldStatus: PackageStatus,
  newStatus: PackageStatus,
  changedBy: number
): Promise<void> {
  const db = await connect();
  await db.query<ResultSetHeader>(
    "INSERT INTO package_status_logs (package_id, old_status, new_status, changed_by) VALUES (?, ?, ?, ?)",
    [packageId, oldStatus, newStatus, changedBy]
  );
}
