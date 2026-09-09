"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AdminProduct, AdminProductInput } from "@/lib/admin-api";

type MeasurementRow = { key: string; value: string };
type SizeRow = { size: string; stock: string };

function toMeasurementRows(m: Record<string, number> | null): MeasurementRow[] {
  if (!m || Object.keys(m).length === 0) return [{ key: "", value: "" }];
  return Object.entries(m).map(([key, value]) => ({ key, value: String(value) }));
}

export default function ProductForm({ product }: { product?: AdminProduct }) {
  const router = useRouter();
  const isEditing = Boolean(product);

  const [ref, setRef] = useState(product?.ref ?? "");
  const [name, setName] = useState(product?.name ?? "");
  const [category, setCategory] = useState(product?.category ?? "");
  const [priceEuros, setPriceEuros] = useState(
    product ? (product.price_cents / 100).toString() : "",
  );
  const [description, setDescription] = useState(product?.description ?? "");
  const [conditionNote, setConditionNote] = useState(product?.condition_note ?? "");
  const [photos, setPhotos] = useState<string[]>(
    product?.photos && product.photos.length > 0 ? product.photos : [""],
  );
  const [measurements, setMeasurements] = useState<MeasurementRow[]>(
    toMeasurementRows(product?.measurements ?? null),
  );
  const [sizes, setSizes] = useState<SizeRow[]>(
    product?.sizes && product.sizes.length > 0
      ? product.sizes.map((s) => ({ size: s.size, stock: String(s.stock) }))
      : [{ size: "", stock: "" }],
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload: AdminProductInput = {
      ref,
      name,
      category,
      price_cents: Math.round(parseFloat(priceEuros) * 100),
      description,
      condition_note: conditionNote || null,
      photos: photos.map((p) => p.trim()).filter(Boolean),
      measurements: Object.fromEntries(
        measurements
          .filter((m) => m.key.trim() && m.value.trim())
          .map((m) => [m.key.trim(), Number(m.value)]),
      ),
      sizes: sizes
        .filter((s) => s.size.trim())
        .map((s) => ({ size: s.size.trim(), stock: Number(s.stock) || 0 })),
    };

    const url = isEditing ? `/api/admin/piezas/${product!.id}` : "/api/admin/piezas";
    const res = await fetch(url, {
      method: isEditing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "No se pudo guardar la pieza");
      return;
    }

    router.push("/admin/piezas");
    router.refresh();
  }

  const inputClass =
    "rounded-md border border-hl-cream bg-white px-3 py-2 font-body text-sm text-hl-green-900 outline-none focus:border-hl-green-700";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-3">
        <input
          required
          placeholder="Referencia (HL-26-0XX)"
          value={ref}
          onChange={(e) => setRef(e.target.value)}
          className={inputClass}
        />
        <input
          required
          placeholder="Categoría"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={inputClass}
        />
        <input
          required
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`${inputClass} col-span-2`}
        />
        <input
          required
          type="number"
          step="0.01"
          min="0"
          placeholder="Precio (€)"
          value={priceEuros}
          onChange={(e) => setPriceEuros(e.target.value)}
          className={inputClass}
        />
        <input
          placeholder="Nota de estado"
          value={conditionNote ?? ""}
          onChange={(e) => setConditionNote(e.target.value)}
          className={inputClass}
        />
      </div>

      <textarea
        required
        placeholder="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
        className={inputClass}
      />

      <div className="flex flex-col gap-2">
        <span className="font-body text-sm text-hl-green-700">Fotos (URLs)</span>
        {photos.map((photo, i) => (
          <div key={i} className="flex gap-2">
            <input
              placeholder="https://…"
              value={photo}
              onChange={(e) =>
                setPhotos((prev) => prev.map((p, j) => (j === i ? e.target.value : p)))
              }
              className={`${inputClass} flex-1`}
            />
            <button
              type="button"
              onClick={() => setPhotos((prev) => prev.filter((_, j) => j !== i))}
              className="font-mono text-xs text-hl-stamp"
            >
              Quitar
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setPhotos((prev) => [...prev, ""])}
          className="w-fit font-mono text-xs text-hl-green-700 underline"
        >
          + Añadir foto
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-body text-sm text-hl-green-700">Medidas</span>
        {measurements.map((m, i) => (
          <div key={i} className="flex gap-2">
            <input
              placeholder="pecho"
              value={m.key}
              onChange={(e) =>
                setMeasurements((prev) =>
                  prev.map((row, j) => (j === i ? { ...row, key: e.target.value } : row)),
                )
              }
              className={`${inputClass} flex-1`}
            />
            <input
              placeholder="58"
              type="number"
              value={m.value}
              onChange={(e) =>
                setMeasurements((prev) =>
                  prev.map((row, j) => (j === i ? { ...row, value: e.target.value } : row)),
                )
              }
              className={`${inputClass} w-24`}
            />
            <button
              type="button"
              onClick={() => setMeasurements((prev) => prev.filter((_, j) => j !== i))}
              className="font-mono text-xs text-hl-stamp"
            >
              Quitar
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setMeasurements((prev) => [...prev, { key: "", value: "" }])}
          className="w-fit font-mono text-xs text-hl-green-700 underline"
        >
          + Añadir medida
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-body text-sm text-hl-green-700">Tallas y stock</span>
        {sizes.map((s, i) => (
          <div key={i} className="flex gap-2">
            <input
              placeholder="M"
              value={s.size}
              onChange={(e) =>
                setSizes((prev) =>
                  prev.map((row, j) => (j === i ? { ...row, size: e.target.value } : row)),
                )
              }
              className={`${inputClass} w-24`}
            />
            <input
              placeholder="Stock"
              type="number"
              min="0"
              value={s.stock}
              onChange={(e) =>
                setSizes((prev) =>
                  prev.map((row, j) => (j === i ? { ...row, stock: e.target.value } : row)),
                )
              }
              className={`${inputClass} w-24`}
            />
            <button
              type="button"
              onClick={() => setSizes((prev) => prev.filter((_, j) => j !== i))}
              className="font-mono text-xs text-hl-stamp"
            >
              Quitar
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setSizes((prev) => [...prev, { size: "", stock: "" }])}
          className="w-fit font-mono text-xs text-hl-green-700 underline"
        >
          + Añadir talla
        </button>
      </div>

      {error && <p className="font-body text-sm text-hl-stamp">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-fit rounded-md bg-hl-green-900 px-4 py-2 font-body text-sm font-medium text-hl-bone disabled:opacity-50"
      >
        {loading ? "Guardando…" : isEditing ? "Guardar cambios" : "Crear pieza"}
      </button>
    </form>
  );
}
