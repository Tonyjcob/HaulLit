const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type ProductSize = {
  size: string;
  stock: number;
};

export type Product = {
  id: number;
  ref: string;
  name: string;
  category: string;
  price_cents: number;
  photos: string[];
  sizes: ProductSize[];
};

export type ProductDetail = Product & {
  description: string;
  measurements: Record<string, number> | null;
  condition_note: string | null;
};

export type Orden = "recientes" | "precio_asc" | "precio_desc";

export async function getProducts(params: {
  categoria?: string;
  orden?: Orden;
}): Promise<Product[]> {
  const query = new URLSearchParams();
  if (params.categoria) query.set("categoria", params.categoria);
  if (params.orden) query.set("orden", params.orden);

  const res = await fetch(`${API_URL}/products?${query.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("No se pudieron cargar los productos");
  return res.json();
}

export async function getCategorias(): Promise<string[]> {
  const res = await fetch(`${API_URL}/products/categorias`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("No se pudieron cargar las categorías");
  return res.json();
}

export function stockTotal(product: Product): number {
  return product.sizes.reduce((sum, s) => sum + s.stock, 0);
}

export async function getProduct(ref: string): Promise<ProductDetail | null> {
  const res = await fetch(`${API_URL}/products/${encodeURIComponent(ref)}`, {
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("No se pudo cargar el producto");
  return res.json();
}

export type CartItem = {
  id: number;
  ref: string;
  name: string;
  photo: string | null;
  size: string;
  quantity: number;
  price_cents: number;
  line_total_cents: number;
};

export type Cart = {
  items: CartItem[];
  subtotal_cents: number;
  shipping_cents: number;
  total_cents: number;
};

export type PaymentMethod = "transferencia" | "bizum";

export type PaymentInstructions = {
  method: PaymentMethod;
  reference: string;
  iban: string | null;
  holder: string | null;
  phone: string | null;
};

export type CheckoutResult = {
  order_id: number;
  total_cents: number;
  payment: PaymentInstructions;
};

export async function getCart(codeId: number): Promise<Cart> {
  const res = await fetch(`${API_URL}/cart/${codeId}`, { cache: "no-store" });
  if (!res.ok) throw new Error("No se pudo cargar el carrito");
  return res.json();
}

export async function getCodeEmail(codeId: number): Promise<string | null> {
  const res = await fetch(`${API_URL}/codes/${codeId}`, { cache: "no-store" });
  if (!res.ok) return null;
  const data: { email: string | null } = await res.json();
  return data.email;
}
