import { NextRequest, NextResponse } from "next/server";
import { getAdminSessionId } from "@/lib/admin-session";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: NextRequest) {
  const adminId = await getAdminSessionId(request);
  if (adminId === null) {
    return NextResponse.json({ error: "Sesión no válida" }, { status: 401 });
  }

  const res = await fetch(`${API_URL}/admin/codes`, { cache: "no-store" });
  if (!res.ok) {
    return NextResponse.json({ error: "No se pudieron cargar los códigos" }, { status: 502 });
  }
  return NextResponse.json(await res.json());
}

export async function POST(request: NextRequest) {
  const adminId = await getAdminSessionId(request);
  if (adminId === null) {
    return NextResponse.json({ error: "Sesión no válida" }, { status: 401 });
  }

  const res = await fetch(`${API_URL}/admin/codes`, {
    method: "POST",
    cache: "no-store",
  });
  if (!res.ok) {
    return NextResponse.json({ error: "No se pudo crear el código" }, { status: 502 });
  }
  return NextResponse.json(await res.json());
}
