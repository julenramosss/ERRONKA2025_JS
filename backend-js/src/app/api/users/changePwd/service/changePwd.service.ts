import { encryptPwd, verifyPassword } from "@/app/lib/hashPasword";
import { NotFoundError, UnauthorizedError } from "@/app/lib/errors";
import {
  getUserPasswordHash,
  updateUserPasswordAndActivate,
} from "../repository/changePwdrepo";
import { ChangePwdDto } from "../types";

export async function changePwdService(
  userId: number,
  dto: ChangePwdDto
): Promise<void> {
  const currentHash = await getUserPasswordHash(userId);
  if (!currentHash) throw new NotFoundError("Erabiltzailea ez da existitzen");

  const ok = await verifyPassword(dto.oldPassword, currentHash);
  if (!ok) throw new UnauthorizedError("Pasahitz zaharra ez da zuzena");

  const newHash = await encryptPwd(dto.newPassword);
  await updateUserPasswordAndActivate(userId, newHash);
}