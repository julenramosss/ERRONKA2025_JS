import { CreateUserDto } from "../types";
import { connect } from "@/app/config/dbConfig";
import { ResultSetHeader, RowDataPacket } from "mysql2";

interface UserIdRow extends RowDataPacket {
  id: number;
}

export async function findUserByEmail(email: string): Promise<boolean> {
  const db = await connect();
  const [rows] = await db.query<UserIdRow[]>(
    "SELECT id FROM users WHERE email = ?",
    [email]
  );
  return rows.length > 0;
}

export async function insertUser(
  dto: CreateUserDto,
  passwordHash: string
): Promise<ResultSetHeader> {
  const db = await connect();
  const [result] = await db.execute<ResultSetHeader>(
    `INSERT INTO users (name, email, password_hash, role, is_active)
     VALUES (?, ?, ?, ?, false)`,
    [dto.name, dto.email, passwordHash, dto.role]
  );
  return result;
}
