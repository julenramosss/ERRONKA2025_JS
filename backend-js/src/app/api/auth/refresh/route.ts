import { validateRefreshDto } from "./dtos/refresh.dto";
import { refreshService } from "./service/refresh.service";
import { handleError, res } from "@/app/lib/response";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const dto = validateRefreshDto(body);
    const result = await refreshService(dto);
    return res.ok(result);
  } catch (error) {
    return handleError("[POST /api/auth/refresh]", error);
  }
}