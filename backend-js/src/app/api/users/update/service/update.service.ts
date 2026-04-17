import { ConflictError, NotFoundError } from "@/app/lib/errors";
import {
  emailTakenByOther,
  existsUser,
  selectUpdatedUser,
  updateUser,
} from "../repository/update.repository";
import { UpdateUserDto, UpdateUserResponse } from "../types";

export async function updateUserService(
  dto: UpdateUserDto
): Promise<UpdateUserResponse> {
  if (!(await existsUser(dto.id))) {
    throw new NotFoundError("Erabiltzailea ez da aurkitu");
  }

  if (dto.email && (await emailTakenByOther(dto.email, dto.id))) {
    throw new ConflictError("Email hori beste erabiltzaile batek erabiltzen du");
  }

  await updateUser(dto.id, { name: dto.name, email: dto.email });
  const updated = await selectUpdatedUser(dto.id);
  if (!updated) throw new NotFoundError("Erabiltzailea ez da aurkitu");

  return { id: updated.id, name: updated.name, email: updated.email };
}
