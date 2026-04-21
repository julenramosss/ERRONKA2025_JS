import { RowDataPacket } from "mysql2/promise";

export interface RemoveUserDto {
  id: number;
}

export interface UserIdRow extends RowDataPacket {
  id: number;
}
