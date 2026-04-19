import { validateListUsersDto } from "./dtos/listUsers.dto";
import { listUsersService } from "./service/listUsers.service";
import { handleError, res } from "@/app/lib/response";
import { requireAuth } from "@/app/lib/jwt";
import { USER_ROLES } from "@/app/types";

export async function GET(request: Request) {
  try {
    requireAuth(request, [USER_ROLES.admin]);
    const url = new URL(request.url);
    const filters = validateListUsersDto(url.searchParams);
    const users = await listUsersService(filters);
    return res.ok(users);
  } catch (error) {
    return handleError("[GET /api/users/list]", error);
  }
}
