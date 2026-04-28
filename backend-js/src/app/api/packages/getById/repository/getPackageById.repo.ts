import { connect } from '@/app/config/dbConfig';
import { RowDataPacket } from 'mysql2/promise';
import { PackageWithAddress } from '../types';

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
