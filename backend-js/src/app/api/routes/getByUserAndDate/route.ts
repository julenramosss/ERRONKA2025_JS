import { requireAuth } from "@/app/lib/jwt";
import { handleError, res } from "@/app/lib/response";
import { USER_ROLES } from "@/app/types";
import { validateGetByUserAndDateDto } from "./dtos/getByUserAndDate.dto";
import { getByUserAndDateService } from "./service/getByUserAndDate.service";

export async function GET(request: Request) {
  try {
    requireAuth(request, [USER_ROLES.admin]);
    const { searchParams } = new URL(request.url);
    const { user_id, date } = validateGetByUserAndDateDto(searchParams);
    const result = await getByUserAndDateService(user_id, date);
    return res.ok(result);
  } catch (error) {
    return handleError("[GET /api/routes/getByUserAndDate]", error);
  }
}
