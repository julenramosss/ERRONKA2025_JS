import { findUserByEmail, insertUser } from '../repository/user.repo';
import { CreateUserDto, CreateUserResponse } from '../types';
import { ConflictError } from '@/app/lib/errors';
import { encryptPwd } from '@/app/lib/hashPasword';
import { default_user_password } from '@/app/config/envConfig';
import { sendActivationEmailService } from '@/app/api/auth/activateAccount/service/activateAccount.service';

export async function createUserService(
  dto: CreateUserDto
): Promise<CreateUserResponse> {
  if (await findUserByEmail(dto.email)) {
    throw new ConflictError('A user with this email already exists');
  }

  const passwordHash = await encryptPwd(default_user_password);
  const result = await insertUser(dto, passwordHash);

  await sendActivationEmailService(dto.email);

  return {
    id: result.insertId,
    name: dto.name,
    email: dto.email,
    role: dto.role,
    is_active: false,
  };
}
