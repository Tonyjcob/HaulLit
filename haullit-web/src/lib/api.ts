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
