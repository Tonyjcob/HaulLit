import { NextRequest, NextResponse } from "next/server";
import { getSessionCodeId } from "@/lib/session";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: NextRequest) {
  const codeId = await getSessionCodeId(request);
  if (codeId === null) {
    return NextResponse.json({ error: "Sesión no válida" }, { status: 401 });
  }

  const body = await request.json();
  const res = await fetch(`${API_URL}/checkout/${codeId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    return NextResponse.json(
      { error: data?.detail ?? "No se pudo completar el pedido" },
      { status: res.status },
    );
  }
  return NextResponse.json(data);
}
