import { validateChangePwdDto } from "./dto/changePwd.dto";
import { changePwdService } from "./service/changePwd.service";
import { handleError, res } from "@/app/lib/response";

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const dto = validateChangePwdDto(body);
    await changePwdService(dto);
    return res.ok({ message: "Password changed successfully" });
  } catch (error) {
    return handleError("[PATCH /api/auth/changePwd]", error);
  }
}
