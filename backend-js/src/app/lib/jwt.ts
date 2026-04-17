import jwt, { SignOptions } from "jsonwebtoken";
import { jwt_access_expires_in, jwt_secret } from "@/app/config/envConfig";
import { UnauthorizedError, ForbiddenError } from "./errors";

export type UserRole = "admin" | "distributor";

export interface AccessTokenPayload {
  sub: number;
  email: string;
  role: UserRole;
}

export function signAccessToken(payload: AccessTokenPayload): string {
  const options: SignOptions = {
    expiresIn: jwt_access_expires_in as SignOptions["expiresIn"],
  };
  return jwt.sign(payload, jwt_secret, options);
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  try {
    const decoded = jwt.verify(token, jwt_secret);
    if (typeof decoded === "string") {
      throw new UnauthorizedError("Token baliogabea");
    }
    const { sub, email, role } = decoded as jwt.JwtPayload & {
      email?: unknown;
      role?: unknown;
    };
    if (
      typeof sub !== "number" ||
      typeof email !== "string" ||
      (role !== "admin" && role !== "distributor")
    ) {
      throw new UnauthorizedError("Token baliogabea");
    }
    return { sub, email, role };
  } catch (error) {
    if (error instanceof UnauthorizedError) throw error;
    throw new UnauthorizedError("Token baliogabea edo iraungita");
  }
}

export function extractBearerToken(req: Request): string {
  const header =
    req.headers.get("authorization") ?? req.headers.get("Authorization");
  if (!header) throw new UnauthorizedError("Authorization goiburua falta da");
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) {
    throw new UnauthorizedError("Bearer token formatu okerra");
  }
  return token;
}

export function requireAuth(
  req: Request,
  allowedRoles?: UserRole[]
): AccessTokenPayload {
  const token = extractBearerToken(req);
  const payload = verifyAccessToken(token);
  if (allowedRoles && !allowedRoles.includes(payload.role)) {
    throw new ForbiddenError("Baimenik ez baliabide honetarako");
  }
  return payload;
}
