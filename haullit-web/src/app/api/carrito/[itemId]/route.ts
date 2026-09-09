import { NextRequest, NextResponse } from "next/server";
import { getSessionCodeId } from "@/lib/session";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> },
) {
  const codeId = await getSessionCodeId(request);
  if (codeId === null) {
    return NextResponse.json({ error: "Sesión no válida" }, { status: 401 });
  }

  const { itemId } = await params;
  const body = await request.json();
  const res = await fetch(`${API_URL}/cart/${codeId}/items/${itemId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!res.ok) {
    return NextResponse.json({ error: "No se pudo actualizar la línea" }, { status: 502 });
  }
  return NextResponse.json(await res.json());
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> },
) {
  const codeId = await getSessionCodeId(request);
  if (codeId === null) {
    return NextResponse.json({ error: "Sesión no válida" }, { status: 401 });
  }

  const { itemId } = await params;
  const res = await fetch(`${API_URL}/cart/${codeId}/items/${itemId}`, {
    method: "DELETE",
    cache: "no-store",
  });

  if (!res.ok) {
    return NextResponse.json({ error: "No se pudo quitar la línea" }, { status: 502 });
  }
  return NextResponse.json(await res.json());
}
