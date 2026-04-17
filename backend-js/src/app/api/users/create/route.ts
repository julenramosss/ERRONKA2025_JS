import { validateCreateUserDto } from "./dtos/createUser.dto";
import { createUserService } from "./service/user.service";
import { handleError, res } from "@/app/lib/response";
import { requireAuth } from "@/app/lib/jwt";

export async function POST(request: Request) {
  try {
    requireAuth(request, ["admin"]);
    const body = await request.json();
    const dto = validateCreateUserDto(body);
    const created = await createUserService(dto);
    return res.created(created);
  } catch (error) {
    return handleError("[POST /api/users/create]", error);
  }
}