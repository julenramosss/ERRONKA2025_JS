import jwt, { SignOptions } from 'jsonwebtoken';
import { jwt_access_expires_in, jwt_secret } from '@/app/config/envConfig';
import { UnauthorizedError, ForbiddenError } from './errors';
import { USER_ROLES, UserRole } from '@/app/types';
import { AccessTokenPayload } from './types';

export function signAccessToken(payload: AccessTokenPayload): string {
  const options: SignOptions = {
    expiresIn: jwt_access_expires_in as SignOptions['expiresIn'],
  };
  return jwt.sign(payload, jwt_secret, options);
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  try {
    const decoded = jwt.verify(token, jwt_secret);
    if (typeof decoded === 'string') {
      throw new UnauthorizedError('Invalid token');
    }
    const { sub, email, role } = decoded as jwt.JwtPayload & {
      email?: unknown;
      role?: unknown;
    };
    if (
      typeof sub !== 'number' ||
      typeof email !== 'string' ||
      !Object.values(USER_ROLES).includes(role as UserRole)
    ) {
      throw new UnauthorizedError('Invalid token');
    }
    return { sub, email, role: role as UserRole };
  } catch (error) {
    if (error instanceof UnauthorizedError) throw error;
    throw new UnauthorizedError('Invalid or expired token');
  }
}

export function extractBearerToken(req: Request): string {
  const header =
    req.headers.get('authorization') ?? req.headers.get('Authorization');
  if (!header) throw new UnauthorizedError('Authorization header is missing');
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) {
    throw new UnauthorizedError('Invalid Bearer token format');
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
    throw new ForbiddenError(
      'You do not have permission to access this resource'
    );
  }
  return payload;
}
