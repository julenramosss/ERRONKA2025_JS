import { connect } from "@/app/config/dbConfig";
import {
  CreateAddressResult,
  CreateAddressInfoDto,
  CreatedPackageResult,
  CreatePackageDto,
} from "../types";
import { ResultSetHeader } from "mysql2/promise";
import { randomUUID } from "crypto";
import { TOKEN_TYPES } from "@/app/types";

export async function createAddress(
  address_info: CreateAddressInfoDto
): Promise<CreateAddressResult> {
  const db = await connect();
  const { street, city, postal_code, latitude, longitude } = address_info;
  const [result] = await db.query<ResultSetHeader>(
    "INSERT INTO addresses (street, city, postal_code, latitude, longitude) VALUES (?, ?, ?, ?, ?)",
    [street, city, postal_code, latitude, longitude]
  );
  return { id: result.insertId, ...address_info };
}

export async function createPackage(
  packageInfo: CreatePackageDto,
  createdAddress: CreateAddressResult
): Promise<{ createdPackage: CreatedPackageResult }> {
  const db = await connect();
  const { id } = createdAddress;
  const {
    recipient_name,
    recipient_email,
    assigned_to,
    created_by,
    status,
    weight_kg,
    description = null,
    estimated_delivery = null,
  } = packageInfo;

  const tracking_code = `PKG-${randomUUID().split("-").slice(0, 3).join("").toUpperCase()}${id}`;

  const [result] = await db.query<ResultSetHeader>(
    "INSERT INTO packages (tracking_code, recipient_name, recipient_email, assigned_to, created_by, status, weight_kg, description, estimated_delivery, address_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      tracking_code,
      recipient_name,
      recipient_email,
      assigned_to,
      created_by,
      status,
      weight_kg,
      description,
      estimated_delivery,
      id,
    ]
  );
  return {
    createdPackage: {
      id: result.insertId,
      ...packageInfo,
      address_id: id,
      tracking_code,
    },
  };
}

export async function createPackageToken(): Promise<{
  id: number;
  token: string;
}> {
  const db = await connect();

  const token = randomUUID();

  const [result] = await db.query<ResultSetHeader>(
    `INSERT INTO tokens (type, token, expires_at) VALUES (?, ?, ?)`,
    [
      TOKEN_TYPES.tracking_token,
      token,
      new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // => 14 days,
    ]
  );
  return {
    id: result.insertId,
    token,
  };
}

export async function addPackageIdToToken(
  tokenId: number,
  packageId: number
): Promise<void> {
  const db = await connect();
  await db.query("UPDATE tokens SET package_id = ? WHERE id = ?", [
    packageId,
    tokenId,
  ]);
}

export async function createPackageLog(
  createdPackage: CreatedPackageResult
): Promise<void> {
  const db = await connect();
  const { id, status, created_by } = createdPackage;
  await db.query<ResultSetHeader>(
    "INSERT INTO package_status_logs (package_id, old_status, new_status, changed_by) VALUES (?, NULL, ?, ?)",
    [id, status, created_by]
  );
}
