import { findUserByEmail, insertUser } from "../repository/user.repo";
import { CreateUserDto, CreateUserResponse } from "../types";
import { ConflictError } from "@/app/lib/errors";
import { encryptPwd } from "@/app/lib/hashPasword";
import { default_user_password } from "@/app/config/envConfig";

export async function createUserService(
  dto: CreateUserDto
): Promise<CreateUserResponse> {
  if (await findUserByEmail(dto.email)) {
    throw new ConflictError("Erabiltzailea dagoeneko existitzen da");
  }

  const passwordHash = await encryptPwd(default_user_password);
  const result = await insertUser(dto, passwordHash);

  return {
    id: result.insertId,
    name: dto.name,
    email: dto.email,
    role: dto.role,
    is_active: false,
  };
}