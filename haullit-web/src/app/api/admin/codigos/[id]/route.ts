import { NextRequest, NextResponse } from "next/server";
import { getAdminSessionId } from "@/lib/admin-session";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const adminId = await getAdminSessionId(request);
  if (adminId === null) {
    return NextResponse.json({ error: "Sesión no válida" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const res = await fetch(`${API_URL}/admin/codes/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!res.ok) {
    return NextResponse.json({ error: "No se pudo actualizar el código" }, { status: 502 });
  }
  return NextResponse.json(await res.json());
}
