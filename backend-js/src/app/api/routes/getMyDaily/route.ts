import { requireAuth } from "@/app/lib/jwt";
import { handleError, res } from "@/app/lib/response";
import { USER_ROLES } from "@/app/types";
import { validateGetMyDailyDto } from "./dtos/getMyDaily.dto";
import { getMyDailyService } from "./service/getMyDaily.service";

export async function GET(request: Request) {
  try {
    const user = requireAuth(request, [USER_ROLES.distributor]);
    const { searchParams } = new URL(request.url);
    const date = validateGetMyDailyDto(searchParams);
    const result = await getMyDailyService(user.sub, date);
    return res.ok(result);
  } catch (error) {
    return handleError("[GET /api/routes/getMyDaily]", error);
  }
}
