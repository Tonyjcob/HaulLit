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

export type OrderStatus = "pending" | "paid" | "shipped" | "cancelled";
export type PaymentMethod = "transferencia" | "bizum";

export type AdminOrderItem = {
  ref: string;
  name: string;
  photo: string | null;
  size: string;
  quantity: number;
  price_cents: number;
};

export type AdminOrder = {
  id: number;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_reference: string;
  code: string;
  email_snapshot: string;
  shipping_address_snapshot: {
    nombre: string;
    direccion: string;
    ciudad: string;
    cp: string;
  };
  subtotal_cents: number;
  shipping_cents: number;
  total_cents: number;
  created_at: string;
  items: AdminOrderItem[];
};

export async function getAdminOrders(): Promise<AdminOrder[]> {
  const res = await fetch(`${API_URL}/admin/orders`, { cache: "no-store" });
  if (!res.ok) throw new Error("No se pudieron cargar los pedidos");
  return res.json();
}
