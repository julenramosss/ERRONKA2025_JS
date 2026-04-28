import { requireAuth } from '@/app/lib/jwt';
import { handleError, res } from '@/app/lib/response';
import { USER_ROLES } from '@/app/types';
import { validateCreateRouteDto } from './dtos/create.dto';
import { createRouteService } from './service/create.service';

export async function POST(request: Request) {
  try {
    requireAuth(request, [USER_ROLES.admin]);
    const body = await request.json();
    const dto = await validateCreateRouteDto(body);
    const result = await createRouteService(dto);
    return res.created(result);
  } catch (error) {
    return handleError('[POST /api/routes/create]', error);
  }
}
