import { requireAuth } from "@/app/lib/jwt";
import { handleError, res } from "@/app/lib/response";
import { updateStatusDto } from "./dto/updateStatus.dto";
import { updateStatusService } from "./service/updateStatus.service";
import { USER_ROLES } from "@/app/types";

export async function PATCH(request: Request) {
  try {
    const auth = requireAuth(request, [USER_ROLES.distributor]);
    const body = await request.json();
    const dto = updateStatusDto(body);
    const updated = await updateStatusService(dto, auth.sub);
    return res.ok(updated);
  } catch (error) {
    return handleError("[PATCH /api/packages/updateStatus]", error);
  }
}
