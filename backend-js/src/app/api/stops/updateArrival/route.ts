import { requireAuth } from '@/app/lib/jwt';
import { handleError, res } from '@/app/lib/response';
import { USER_ROLES } from '@/app/types';
import { validateUpdateArrivalDto } from './dtos/updateArrival.dto';
import { updateArrivalService } from './service/updateArrival.service';

export async function PATCH(request: Request) {
  try {
    const user = requireAuth(request, [USER_ROLES.distributor]);
    const body = await request.json();
    const dto = validateUpdateArrivalDto(body);
    const result = await updateArrivalService(dto.stop_id, user.sub);
    return res.ok(result);
  } catch (error) {
    return handleError('[PATCH /api/stops/updateArrival]', error);
  }
}
