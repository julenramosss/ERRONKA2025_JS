import { connect } from "@/app/config/dbConfig";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { PackageRow } from "../types";

export async function findPackageById(id: number): Promise<PackageRow | null> {
  const db = await connect();
  const [rows] = await db.query<(RowDataPacket & PackageRow)[]>(
    "SELECT id, status, address_id FROM packages WHERE id = ?",
    [id]
  );
  return rows[0] ?? null;
}

export async function deletePackageById(id: number): Promise<void> {
  const db = await connect();
  await db.query<ResultSetHeader>("DELETE FROM packages WHERE id = ?", [id]);
}

export async function deleteAddressById(addressId: number): Promise<void> {
  const db = await connect();
  await db.query<ResultSetHeader>("DELETE FROM addresses WHERE id = ?", [addressId]);
}
