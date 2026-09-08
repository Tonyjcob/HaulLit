import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/session";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function redirectToAcceso(request: NextRequest, reason?: string): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = "/acceso";
  url.search = reason ? `?${reason}=1` : "";
  const response = NextResponse.redirect(url);
  response.cookies.delete(SESSION_COOKIE_NAME);
  return response;
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return redirectToAcceso(request);
  }

  const codeId = await verifySessionToken(token);
  if (codeId === null) {
    return redirectToAcceso(request);
  }

  try {
    const res = await fetch(`${API_URL}/codes/${codeId}/status`, {
      cache: "no-store",
    });
    if (!res.ok) {
      return redirectToAcceso(request, "revocado");
    }
    const data: { active: boolean } = await res.json();
    if (!data.active) {
      return redirectToAcceso(request, "revocado");
    }
  } catch {
    return redirectToAcceso(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|acceso|api/acceso).*)"],
};
