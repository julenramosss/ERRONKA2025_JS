import { requireAuth } from "@/app/lib/jwt";
import { handleError, res } from "@/app/lib/response";
import { USER_ROLES } from "@/app/types";
import { removeUserDto } from "./dto/remove.dto";
import { removeUserService } from "./service/remove.service";

export async function DELETE(request: Request) {
  try {
    const user = requireAuth(request, [USER_ROLES.admin]);
    const url = new URL(request.url);
    const { id } = await removeUserDto(url, user);
    await removeUserService(id);
    return res.noContent();
  } catch (error) {
    return handleError("[DELETE /api/users/remove]", error);
  }
}
