import { RowDataPacket } from 'mysql2/promise';

export interface ChangeMyPwdDto {
  currentPassword: string;
  newPassword: string;
}

export interface ChangeMyPwdResponse {
  message: string;
}

export interface UserPasswordRow extends RowDataPacket {
  id: number;
  password_hash: string;
}
