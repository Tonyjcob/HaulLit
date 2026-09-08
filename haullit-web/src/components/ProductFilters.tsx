"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { Orden } from "@/lib/api";

export default function ProductFilters({
  categorias,
}: {
  categorias: string[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoria = searchParams.get("categoria") ?? "";
  const orden = (searchParams.get("orden") as Orden) ?? "recientes";

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-3">
      <select
        value={categoria}
        onChange={(e) => updateParam("categoria", e.target.value)}
        className="rounded-md border border-hl-cream bg-white px-3 py-2 font-body text-sm text-hl-green-900"
      >
        <option value="">Todas las categorías</option>
        {categorias.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select
        value={orden}
        onChange={(e) => updateParam("orden", e.target.value)}
        className="rounded-md border border-hl-cream bg-white px-3 py-2 font-body text-sm text-hl-green-900"
      >
        <option value="recientes">Más recientes</option>
        <option value="precio_asc">Precio: menor a mayor</option>
        <option value="precio_desc">Precio: mayor a menor</option>
      </select>
    </div>
  );
}
