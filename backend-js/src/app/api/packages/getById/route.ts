import { requireAuth } from '@/app/lib/jwt';
import { handleError, res } from '@/app/lib/response';
import { getPackageByIdDto } from './dto/getPackageById.dto';
import { getPackageByIdService } from './service/getPackageById.service';
import { USER_ROLES } from '@/app/types';

export async function GET(request: Request) {
  try {
    const auth = requireAuth(request, [
      USER_ROLES.admin,
      USER_ROLES.distributor,
    ]);
    const url = new URL(request.url);
    const { id } = getPackageByIdDto(url);
    const pkg = await getPackageByIdService(id, auth);
    return res.ok(pkg);
  } catch (error) {
    return handleError('[GET /api/packages/getById]', error);
  }
}
