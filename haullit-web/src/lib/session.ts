import { SignJWT, jwtVerify } from "jose";
import type { NextRequest } from "next/server";

export const SESSION_COOKIE_NAME = "hl_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // 1 año — techo de seguridad, no el mecanismo de revocación

function getSecretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET no está configurado");
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(codeId: number): Promise<string> {
  return new SignJWT({ sub: String(codeId) })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifySessionToken(token: string): Promise<number | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    const codeId = Number(payload.sub);
    return Number.isInteger(codeId) ? codeId : null;
  } catch {
    return null;
  }
}

export async function getSessionCodeId(
  request: NextRequest,
): Promise<number | null> {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  return token ? verifySessionToken(token) : null;
}

/** Igual que getSessionCodeId pero para Server Components, que leen la
 * cookie via next/headers en vez de un NextRequest. */
export async function getSessionCodeIdFromCookies(): Promise<number | null> {
  const { cookies } = await import("next/headers");
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  return token ? verifySessionToken(token) : null;
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_MAX_AGE_SECONDS,
};
