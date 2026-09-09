import { NextRequest, NextResponse } from "next/server";
import { getSessionCodeId } from "@/lib/session";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function PATCH(request: NextRequest) {
  const codeId = await getSessionCodeId(request);
  if (codeId === null) {
    return NextResponse.json({ error: "Sesión no válida" }, { status: 401 });
  }

  const body = await request.json();
  const res = await fetch(`${API_URL}/codes/${codeId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "No se pudo guardar la cuenta" },
      { status: 502 },
    );
  }
  return NextResponse.json(await res.json());
}
