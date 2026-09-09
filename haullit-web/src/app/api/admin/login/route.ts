import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE_NAME,
  adminSessionCookieOptions,
  createAdminSessionToken,
} from "@/lib/admin-session";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (typeof email !== "string" || typeof password !== "string") {
    return NextResponse.json({ error: "Faltan credenciales" }, { status: 400 });
  }

  const apiResponse = await fetch(`${API_URL}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });

  if (!apiResponse.ok) {
    return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
  }

  const data: { id: number } = await apiResponse.json();
  const token = await createAdminSessionToken(data.id);

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_SESSION_COOKIE_NAME, token, adminSessionCookieOptions);
  return response;
}
