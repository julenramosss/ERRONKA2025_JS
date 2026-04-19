import { requireAuth } from "@/app/lib/jwt";
import { handleError, res } from "@/app/lib/response";
import { USER_ROLES } from "@/app/types";
import { validateReorderDto } from "./dtos/reorder.dto";
import { reorderStopsService } from "./service/reorder.service";

export async function PATCH(request: Request) {
  try {
    requireAuth(request, [USER_ROLES.admin]);
    const body = await request.json();
    const dto = validateReorderDto(body);
    const result = await reorderStopsService(dto);
    return res.ok(result);
  } catch (error) {
    return handleError("[PATCH /api/stops/reorder]", error);
  }
}
