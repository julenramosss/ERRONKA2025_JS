import { validateGetUserByIdDto } from './dtos/getById.dto';
import { getUserByIdService } from './service/getById.service';
import { handleError, res } from '@/app/lib/response';
import { requireAuth } from '@/app/lib/jwt';
import { USER_ROLES } from '@/app/types';

export async function GET(request: Request) {
  try {
    requireAuth(request, [USER_ROLES.admin]);
    const url = new URL(request.url);
    const { id } = validateGetUserByIdDto(url.searchParams);
    const user = await getUserByIdService(id);
    return res.ok(user);
  } catch (error) {
    return handleError('[GET /api/users/getById]', error);
  }
}
