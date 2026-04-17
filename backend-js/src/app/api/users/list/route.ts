import { validateListUsersDto } from "./dtos/listUsers.dto";
import { listUsersService } from "./service/listUsers.service";
import { handleError, res } from "@/app/lib/response";
import { requireAuth } from "@/app/lib/jwt";

export async function GET(request: Request) {
  try {
    requireAuth(request, ["admin"]);
    const url = new URL(request.url);
    const filters = validateListUsersDto(url.searchParams);
    const users = await listUsersService(filters);
    return res.ok(users);
  } catch (error) {
    return handleError("[GET /api/users/list]", error);
  }
}
