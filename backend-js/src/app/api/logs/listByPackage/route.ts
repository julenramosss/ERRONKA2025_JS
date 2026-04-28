import { requireAuth } from '@/app/lib/jwt';
import { handleError, res } from '@/app/lib/response';
import { USER_ROLES } from '@/app/types';
import { listByPackageDto } from './dto/listByPackage.dto';
import { listByPackageService } from './service/listByPackage.service';

export async function GET(request: Request) {
  try {
    const caller = requireAuth(request, [
      USER_ROLES.admin,
      USER_ROLES.distributor,
    ]);
    const url = new URL(request.url);
    const filters = await listByPackageDto(url);
    const result = await listByPackageService(filters, caller);
    return res.ok(result);
  } catch (error) {
    return handleError('[GET /api/logs/listByPackage]', error);
  }
}
