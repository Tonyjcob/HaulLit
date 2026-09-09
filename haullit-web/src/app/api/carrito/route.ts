import { NextRequest, NextResponse } from "next/server";
import { getSessionCodeId } from "@/lib/session";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: NextRequest) {
  const codeId = await getSessionCodeId(request);
  if (codeId === null) {
    return NextResponse.json({ error: "Sesión no válida" }, { status: 401 });
  }

  const res = await fetch(`${API_URL}/cart/${codeId}`, { cache: "no-store" });
  if (!res.ok) {
    return NextResponse.json({ error: "No se pudo cargar el carrito" }, { status: 502 });
  }
  return NextResponse.json(await res.json());
}

export async function POST(request: NextRequest) {
  const codeId = await getSessionCodeId(request);
  if (codeId === null) {
    return NextResponse.json({ error: "Sesión no válida" }, { status: 401 });
  }

  const body = await request.json();
  const res = await fetch(`${API_URL}/cart/${codeId}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    return NextResponse.json(
      { error: data?.detail ?? "No se pudo añadir al carrito" },
      { status: res.status },
    );
  }
  return NextResponse.json(await res.json());
}
