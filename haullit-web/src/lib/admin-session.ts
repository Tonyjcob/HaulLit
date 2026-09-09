import { SignJWT, jwtVerify } from "jose";
import type { NextRequest } from "next/server";

export const ADMIN_SESSION_COOKIE_NAME = "hl_admin_session";
const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 12; // 12h — sesion de un solo operador de confianza
const ADMIN_JWT_PURPOSE = "admin";

function getSecretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET no está configurado");
  }
  return new TextEncoder().encode(secret);
}

export async function createAdminSessionToken(adminId: number): Promise<string> {
  return new SignJWT({ sub: String(adminId), purpose: ADMIN_JWT_PURPOSE })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${ADMIN_SESSION_MAX_AGE_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifyAdminSessionToken(token: string): Promise<number | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (payload.purpose !== ADMIN_JWT_PURPOSE) return null;
    const adminId = Number(payload.sub);
    return Number.isInteger(adminId) ? adminId : null;
  } catch {
    return null;
  }
}

export async function getAdminSessionId(
  request: NextRequest,
): Promise<number | null> {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value;
  return token ? verifyAdminSessionToken(token) : null;
}

export async function getAdminSessionIdFromCookies(): Promise<number | null> {
  const { cookies } = await import("next/headers");
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE_NAME)?.value;
  return token ? verifyAdminSessionToken(token) : null;
}

export const adminSessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
};
