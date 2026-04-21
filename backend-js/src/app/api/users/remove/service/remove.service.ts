import { ConflictError, NotFoundError } from "@/app/lib/errors";
import {
  deleteUserById,
  findUserById,
  hasBlockingUserReferences,
} from "../repository/remove.repository";

export async function removeUserService(id: number): Promise<void> {
  const user = await findUserById(id);
  if (!user) throw new NotFoundError("User not found");

  if (await hasBlockingUserReferences(id)) {
    throw new ConflictError("User cannot be deleted because it has related records");
  }

  await deleteUserById(id);
}
