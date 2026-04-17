import { validateGetUserByIdDto } from "./dtos/getById.dto";
import { getUserByIdService } from "./service/getById.service";
import { handleError, res } from "@/app/lib/response";
import { requireAuth } from "@/app/lib/jwt";

export async function GET(request: Request) {
  try {
    requireAuth(request, ["admin"]);
    const url = new URL(request.url);
    const { id } = validateGetUserByIdDto(url.searchParams);
    const user = await getUserByIdService(id);
    return res.ok(user);
  } catch (error) {
    return handleError("[GET /api/users/getById]", error);
  }
}
