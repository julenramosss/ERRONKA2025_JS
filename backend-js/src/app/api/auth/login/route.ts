import { handleError, res } from "@/app/lib/response";
import { validateLoginDto } from "./dtos/login.dto";
import { loginService } from "./service/login.service";

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "Ezezaguna";
  }

  return (
    request.headers.get("x-real-ip") ??
    request.headers.get("cf-connecting-ip") ??
    "Ezezaguna"
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const dto = validateLoginDto(body);
    const result = await loginService(dto, {
      ipAddress: getClientIp(request),
      userAgent: request.headers.get("user-agent")?.trim() || "Ezezaguna",
    });
    const { refresh_token, ...responseBody } = result;

    return res.ok(responseBody, [
      { name: "refresh_token", value: refresh_token, httpOnly: true },
    ]);
  } catch (error) {
    return handleError("[POST /api/auth/login]", error);
  }
}
