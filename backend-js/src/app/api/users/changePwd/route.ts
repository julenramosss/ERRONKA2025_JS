import { validateChangePwdDto } from "./dto/changePwd.dto";
import { changePwdService } from "./service/changePwd.service";
import { handleError, res } from "@/app/lib/response";
import { requireAuth } from "@/app/lib/jwt";

export async function PATCH(request: Request) {
  try {
    const auth = requireAuth(request);
    const body = await request.json();
    const dto = validateChangePwdDto(body);
    await changePwdService(auth.sub, dto);
    return res.ok({ message: "Pasahitza behar bezala aldatu da" });
  } catch (error) {
    return handleError("[PATCH /api/users/changePwd]", error);
  }
}
