import { validateLoginDto } from "./dtos/login.dto";
import { loginService } from "./service/login.service";
import { handleError, res } from "@/app/lib/response";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const dto = validateLoginDto(body);
    const result = await loginService(dto);
    return res.ok(result);
  } catch (error) {
    return handleError("[POST /api/auth/login]", error);
  }
}