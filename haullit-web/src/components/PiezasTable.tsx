"use client";

import { useState } from "react";
import Link from "next/link";
import type { AdminProduct } from "@/lib/admin-api";

function formatPrice(cents: number): string {
  return (cents / 100).toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function PiezasTable({ initialProducts }: { initialProducts: AdminProduct[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete(product: AdminProduct) {
    setError(null);
    const res = await fetch(`/api/admin/piezas/${product.id}`, { method: "DELETE" });
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
    } else {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "No se pudo borrar");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {error && <p className="font-body text-sm text-hl-stamp">{error}</p>}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-left font-mono text-sm">
          <thead>
            <tr className="border-b border-hl-cream text-hl-green-700">
              <th className="py-2 pr-4">Ref</th>
              <th className="py-2 pr-4">Nombre</th>
              <th className="py-2 pr-4">Categoría</th>
              <th className="py-2 pr-4">Precio</th>
              <th className="py-2 pr-4">Stock</th>
              <th className="py-2 pr-4"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-hl-cream text-hl-green-900">
                <td className="py-2 pr-4">{product.ref}</td>
                <td className="py-2 pr-4">{product.name}</td>
                <td className="py-2 pr-4">{product.category}</td>
                <td className="py-2 pr-4">{formatPrice(product.price_cents)}&nbsp;€</td>
                <td className="py-2 pr-4">
                  {product.sizes.reduce((sum, s) => sum + s.stock, 0)}
                </td>
                <td className="flex gap-3 py-2 pr-4">
                  <Link
                    href={`/admin/piezas/${product.id}/editar`}
                    className="text-xs underline text-hl-green-700"
                  >
                    Editar
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(product)}
                    className="text-xs underline text-hl-stamp"
                  >
                    Borrar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
