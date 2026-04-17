import { validateLogoutDto } from "./dtos/logout.dto";
import { logoutService } from "./service/logout.service";
import { handleError, res } from "@/app/lib/response";
import { requireAuth } from "@/app/lib/jwt";

export async function POST(request: Request) {
  try {
    const auth = requireAuth(request);
    const body = await request.json();
    const dto = validateLogoutDto(body);
    await logoutService(auth.sub, dto);
    return res.ok({ message: "Saioa itxi da" });
  } catch (error) {
    return handleError("[POST /api/auth/logout]", error);
  }
}