import { NextRequest, NextResponse } from "next/server";
import { getSessionCodeId } from "@/lib/session";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: NextRequest) {
  const codeId = await getSessionCodeId(request);

  if (codeId === null) {
    return NextResponse.json({ error: "Sesión no válida" }, { status: 401 });
  }

  const { email } = await request.json();
  if (typeof email !== "string" || email.trim() === "") {
    return NextResponse.json({ error: "Introduce un email" }, { status: 400 });
  }

  const apiResponse = await fetch(`${API_URL}/codes/${codeId}/email`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim() }),
    cache: "no-store",
  });

  if (!apiResponse.ok) {
    return NextResponse.json(
      { error: "No se pudo guardar el email" },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
