import { validateChangePwdDto } from "./dto/changePwd.dto";
import {
  changePwdService,
  checkTokenService,
} from "./service/changePwd.service";
import { handleError, res } from "@/app/lib/response";

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const dto = validateChangePwdDto(body);

    if (!dto.newPassword) {
      const valid = await checkTokenService(dto.reset_pwd_token);
      return res.ok({ valid });
    }

    await changePwdService({ ...dto, newPassword: dto.newPassword });
    return res.ok({ message: "Password changed successfully" });
  } catch (error) {
    return handleError("[PATCH /api/auth/changePwd]", error);
  }
}
