import { NextRequest, NextResponse } from "next/server";
import { getAdminSessionId } from "@/lib/admin-session";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: NextRequest) {
  const adminId = await getAdminSessionId(request);
  if (adminId === null) {
    return NextResponse.json({ error: "Sesión no válida" }, { status: 401 });
  }

  const res = await fetch(`${API_URL}/admin/products`, { cache: "no-store" });
  if (!res.ok) {
    return NextResponse.json({ error: "No se pudieron cargar las piezas" }, { status: 502 });
  }
  return NextResponse.json(await res.json());
}

export async function POST(request: NextRequest) {
  const adminId = await getAdminSessionId(request);
  if (adminId === null) {
    return NextResponse.json({ error: "Sesión no válida" }, { status: 401 });
  }

  const body = await request.json();
  const res = await fetch(`${API_URL}/admin/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    return NextResponse.json(
      { error: data?.detail ?? "No se pudo crear la pieza" },
      { status: res.status },
    );
  }
  return NextResponse.json(data);
}
