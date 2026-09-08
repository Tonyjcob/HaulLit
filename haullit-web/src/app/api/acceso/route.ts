import { NextRequest, NextResponse } from "next/server";
import {
  createSessionToken,
  sessionCookieOptions,
  SESSION_COOKIE_NAME,
} from "@/lib/session";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: NextRequest) {
  const { code } = await request.json();

  if (typeof code !== "string" || code.trim() === "") {
    return NextResponse.json({ error: "Introduce un código" }, { status: 400 });
  }

  const apiResponse = await fetch(`${API_URL}/codes/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code: code.trim() }),
    cache: "no-store",
  });

  if (!apiResponse.ok) {
    return NextResponse.json({ error: "Código inválido" }, { status: 401 });
  }

  const data: { id: number } = await apiResponse.json();
  const token = await createSessionToken(data.id);

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, token, sessionCookieOptions);
  return response;
}
