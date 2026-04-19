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
    throw new NotFoundError("User not found");
  }

  if (dto.user.email && (await emailTakenByOther(dto.user.email, dto.id))) {
    throw new ConflictError("This email is already in use by another user");
  }

  await updateUser(dto.id, dto.user);
  const updated = await selectUpdatedUser(dto.id);
  if (!updated) throw new NotFoundError("User not found");

  return {
    id: updated.id,
    name: updated.name,
    email: updated.email,
    role: updated.role,
    is_active: Boolean(updated.is_active),
  };
}
