import { requireAuth } from "@/app/lib/jwt";
import { handleError, res } from "@/app/lib/response";
import { USER_ROLES } from "@/app/types";
import { updateRouteStatusDto } from "./dto/updateRouteStatus.dto";
import { updateRouteStatusService } from "./service/updateRouteStatus.service";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const caller = requireAuth(request, [
      USER_ROLES.admin,
      USER_ROLES.distributor,
    ]);
    const { id } = await params;
    const body = await request.json();
    const dto = updateRouteStatusDto(id, body);
    await updateRouteStatusService(dto, caller);
    return res.ok({ message: "Route status updated" });
  } catch (error) {
    return handleError("[PATCH /api/routes/updateStatus/[id]]", error);
  }
}
