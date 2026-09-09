"use client";

import { useState } from "react";
import type { ProductDetail } from "@/lib/api";
import { stockTotal } from "@/lib/api";
import { CART_UPDATED_EVENT } from "@/components/CartWidget";

function formatPrice(cents: number): string {
  return (cents / 100).toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function NotifyMeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    const res = await fetch("/api/notificar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setStatus(res.ok ? "done" : "error");
  }

  if (status === "done") {
    return (
      <p className="font-body text-sm text-hl-green-700">
        Te avisaremos en {email} si vuelve a haber stock.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="tu@email.com"
        className="rounded-md border border-hl-cream bg-white px-3 py-2 font-body text-sm text-hl-green-900 outline-none focus:border-hl-green-700"
      />
      {status === "error" && (
        <p className="font-body text-sm text-hl-stamp">
          No se pudo guardar, inténtalo de nuevo.
        </p>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-md bg-hl-green-900 px-3 py-2 font-body text-sm font-medium text-hl-bone disabled:opacity-50"
      >
        {status === "loading" ? "Guardando…" : "Avísame si vuelve"}
      </button>
    </form>
  );
}

export default function ProductPurchasePanel({
  product,
}: {
  product: ProductDetail;
}) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showNotify, setShowNotify] = useState(false);
  const [addStatus, setAddStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  const agotado = stockTotal(product) === 0;

  async function handleAddToCart() {
    if (!selectedSize) return;
    setAddStatus("loading");

    const res = await fetch("/api/carrito", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ref: product.ref, size: selectedSize, quantity: 1 }),
    });

    setAddStatus(res.ok ? "done" : "error");
    if (res.ok) {
      window.dispatchEvent(new Event(CART_UPDATED_EVENT));
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <span className="font-mono text-sm text-hl-green-700">
        {product.ref}
      </span>
      <h1 className="font-display text-3xl uppercase text-hl-green-900">
        {product.name}
      </h1>
      <span className="font-mono text-lg font-medium text-hl-green-900">
        {formatPrice(product.price_cents)}&nbsp;€
      </span>

      <p className="font-body text-sm text-hl-green-700">
        {product.description}
      </p>

      {product.measurements && (
        <dl className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-sm text-hl-green-900">
          {Object.entries(product.measurements).map(([key, value]) => (
            <div key={key} className="flex justify-between gap-2">
              <dt className="capitalize text-hl-green-700">{key}</dt>
              <dd>{value} cm</dd>
            </div>
          ))}
        </dl>
      )}

      {product.condition_note && (
        <p className="font-body text-sm text-hl-green-700">
          Estado: {product.condition_note}
        </p>
      )}

      {agotado ? (
        <div className="flex flex-col gap-3">
          <span className="w-fit rounded bg-hl-green-900 px-2 py-1 font-mono text-xs text-hl-bone">
            Vendido
          </span>
          {showNotify ? (
            <NotifyMeForm />
          ) : (
            <button
              type="button"
              onClick={() => setShowNotify(true)}
              className="w-fit rounded-md border border-hl-green-900 px-3 py-2 font-body text-sm font-medium text-hl-green-900"
            >
              Avísame si vuelve
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s.size}
                type="button"
                disabled={s.stock === 0}
                onClick={() => {
                  setSelectedSize(s.size);
                  setAddStatus("idle");
                }}
                className={`rounded-md border px-3 py-2 font-mono text-sm ${
                  s.stock === 0
                    ? "cursor-not-allowed border-hl-cream text-hl-green-700 line-through opacity-50"
                    : selectedSize === s.size
                      ? "border-hl-green-900 bg-hl-green-900 text-hl-bone"
                      : "border-hl-green-900 text-hl-green-900"
                }`}
              >
                {s.size}
              </button>
            ))}
          </div>

          <button
            type="button"
            disabled={!selectedSize || addStatus === "loading"}
            onClick={handleAddToCart}
            className="w-fit rounded-md bg-hl-green-900 px-4 py-2 font-body text-sm font-medium text-hl-bone disabled:opacity-50"
          >
            {addStatus === "loading"
              ? "Añadiendo…"
              : addStatus === "done"
                ? "Añadido ✓"
                : "Añadir al carrito"}
          </button>
          {addStatus === "error" && (
            <p className="font-body text-sm text-hl-stamp">
              No se pudo añadir, inténtalo de nuevo.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
