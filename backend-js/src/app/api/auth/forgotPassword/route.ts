import { handleError, res } from "@/app/lib/response";
import { forgotPasswordDto } from "./dto/forgotPassword.dto";
import { forgotPasswordService } from "./service/forgotPassword.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = forgotPasswordDto(body);
    await forgotPasswordService(email);
    return res.ok({
      message:
        "If that email exists, you will receive a reset password link shortly in your inbox. Please check it out and also the spam folder just in case.",
    });
  } catch (error) {
    return handleError("[POST /api/auth/forgotPassword]", error);
  }
}
