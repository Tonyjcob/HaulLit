const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type CodeStatus = "active" | "revoked";

export type AdminCode = {
  id: number;
  code: string;
  status: CodeStatus;
  email: string | null;
  created_at: string;
  last_seen_at: string | null;
};

export async function getAdminCodes(): Promise<AdminCode[]> {
  const res = await fetch(`${API_URL}/admin/codes`, { cache: "no-store" });
  if (!res.ok) throw new Error("No se pudieron cargar los códigos");
  return res.json();
}

export type AdminProductSize = {
  size: string;
  stock: number;
};

export type AdminProduct = {
  id: number;
  ref: string;
  name: string;
  category: string;
  price_cents: number;
  description: string;
  measurements: Record<string, number> | null;
  photos: string[];
  condition_note: string | null;
  sizes: AdminProductSize[];
};

export type AdminProductInput = {
  ref: string;
  name: string;
  category: string;
  price_cents: number;
  description: string;
  measurements: Record<string, number>;
  photos: string[];
  condition_note: string | null;
  sizes: AdminProductSize[];
};

export async function getAdminProducts(): Promise<AdminProduct[]> {
  const res = await fetch(`${API_URL}/admin/products`, { cache: "no-store" });
  if (!res.ok) throw new Error("No se pudieron cargar las piezas");
  return res.json();
}

export async function getAdminProduct(id: number): Promise<AdminProduct | null> {
  const res = await fetch(`${API_URL}/admin/products/${id}`, {
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("No se pudo cargar la pieza");
  return res.json();
}
