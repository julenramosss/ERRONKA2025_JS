import { resend_api_key } from "@/app/config/envConfig";
import { Resend } from "resend";

export const resendClient = new Resend(resend_api_key);
