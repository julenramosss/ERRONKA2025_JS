import { requireAuth } from '@/app/lib/jwt';
import { handleError, res } from '@/app/lib/response';
import { USER_ROLES } from '@/app/types';
import { listAllLogsDto } from './dto/listAllLogs.dto';
import { listAllLogsService } from './service/listAllLogs.service';

export async function GET(request: Request) {
  try {
    requireAuth(request, [USER_ROLES.admin]);
    const url = new URL(request.url);
    const filters = await listAllLogsDto(url);
    const result = await listAllLogsService(filters);
    return res.ok(result);
  } catch (error) {
    return handleError('[GET /api/logs/listAll]', error);
  }
}
