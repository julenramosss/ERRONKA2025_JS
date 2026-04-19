import { connect } from "@/app/config/dbConfig";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { PackageStatus } from "@/app/types";
import { PackageWithAddress, UpdatePackageDto } from "../types";

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

export async function validateDistributorExists(
  userId: number
): Promise<boolean> {
  const db = await connect();
  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT id FROM users WHERE id = ? AND role = 'distributor' AND is_active = 1",
    [userId]
  );
  return rows.length > 0;
}

export async function updatePackageFields(
  id: number,
  fields: UpdatePackageDto
): Promise<void> {
  const sets: string[] = [];
  const params: unknown[] = [];

  if (fields.recipient_name !== undefined) {
    sets.push("recipient_name = ?");
    params.push(fields.recipient_name);
  }
  if (fields.recipient_email !== undefined) {
    sets.push("recipient_email = ?");
    params.push(fields.recipient_email);
  }
  if (fields.assigned_to !== undefined) {
    sets.push("assigned_to = ?");
    params.push(fields.assigned_to);
  }
  if (fields.status !== undefined) {
    sets.push("status = ?");
    params.push(fields.status);
  }
  if (fields.weight_kg !== undefined) {
    sets.push("weight_kg = ?");
    params.push(fields.weight_kg);
  }
  if (fields.description !== undefined) {
    sets.push("description = ?");
    params.push(fields.description);
  }
  if (fields.estimated_delivery !== undefined) {
    sets.push("estimated_delivery = ?");
    params.push(fields.estimated_delivery);
  }

  if (sets.length === 0) return;
  params.push(id);
  const db = await connect();
  await db.query<ResultSetHeader>(
    `UPDATE packages SET ${sets.join(", ")} WHERE id = ?`,
    params
  );
}

export async function updateAddressFields(
  sets: string[],
  params: unknown[]
): Promise<void> {
  if (sets.length === 0) return;
  const db = await connect();
  await db.query<ResultSetHeader>(
    `UPDATE addresses SET ${sets.join(", ")} WHERE id = ?`,
    params
  );
}

export async function insertStatusLog(
  packageId: number,
  oldStatus: PackageStatus | null,
  newStatus: PackageStatus,
  changedBy: number
): Promise<void> {
  const db = await connect();
  await db.query<ResultSetHeader>(
    "INSERT INTO package_status_logs (package_id, old_status, new_status, changed_by) VALUES (?, ?, ?, ?)",
    [packageId, oldStatus, newStatus, changedBy]
  );
}

export async function getTrackingTokenByPackageId(
  packageId: number
): Promise<string | null> {
  const db = await connect();
  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT tracking_code FROM packages WHERE id = ?",
    [packageId]
  );
  return rows[0]?.tracking_code ?? null;
}

export async function getDistributorName(
  distributorId: number | null
): Promise<string | null> {
  if (distributorId === null) return null;
  const db = await connect();
  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT name FROM users WHERE id = ?",
    [distributorId]
  );
  return rows[0]?.name ?? null;
}
