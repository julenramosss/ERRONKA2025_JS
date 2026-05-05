import { NotFoundError } from '@/app/lib/errors';
import { deleteUserById, findUserById } from '../repository/remove.repository';

export async function removeUserService(id: number): Promise<void> {
  const user = await findUserById(id);
  if (!user) throw new NotFoundError('User not found');

  await deleteUserById(id);
}
