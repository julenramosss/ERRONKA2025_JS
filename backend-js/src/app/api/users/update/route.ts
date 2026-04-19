import { validateUpdateUserDto } from "./dtos/update.dto";
import { updateUserService } from "./service/update.service";
import { handleError, res } from "@/app/lib/response";
import { requireAuth } from "@/app/lib/jwt";
import { USER_ROLES } from "@/app/types";

export async function PATCH(request: Request) {
  try {
    requireAuth(request, [USER_ROLES.admin]);
    const body = await request.json();
    const dto = validateUpdateUserDto(body);
    const updated = await updateUserService(dto);
    return res.ok(updated);
  } catch (error) {
    return handleError("[PATCH /api/users/update]", error);
  }
}
