"use client";

import Link from "next/link";
import type { Cart } from "@/lib/api";

function formatPrice(cents: number): string {
  return (cents / 100).toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function CartDrawer({
  cart,
  onClose,
  onCartChange,
}: {
  cart: Cart | null;
  onClose: () => void;
  onCartChange: (cart: Cart) => void;
}) {
  async function updateQuantity(itemId: number, quantity: number) {
    const res = await fetch(`/api/carrito/${itemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });
    if (res.ok) onCartChange(await res.json());
  }

  async function removeItem(itemId: number) {
    const res = await fetch(`/api/carrito/${itemId}`, { method: "DELETE" });
    if (res.ok) onCartChange(await res.json());
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Cerrar carrito"
        onClick={onClose}
        className="absolute inset-0 bg-hl-green-900/40"
      />

      <div className="relative flex h-full w-full max-w-sm flex-col gap-4 bg-hl-bone px-6 py-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl uppercase text-hl-green-900">
            Carrito
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="font-body text-sm text-hl-green-700"
          >
            Cerrar
          </button>
        </div>

        {!cart || cart.items.length === 0 ? (
          <p className="font-body text-sm text-hl-green-700">
            Tu carrito está vacío.
          </p>
        ) : (
          <>
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto">
              {cart.items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  {item.photo && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.photo}
                      alt={item.name}
                      className="h-20 w-16 rounded object-cover"
                    />
                  )}
                  <div className="flex flex-1 flex-col gap-1">
                    <span className="font-body text-sm text-hl-green-900">
                      {item.name}
                    </span>
                    <span className="font-mono text-xs text-hl-green-700">
                      Talla {item.size}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="rounded border border-hl-green-900 px-2 font-mono text-sm text-hl-green-900"
                      >
                        −
                      </button>
                      <span className="font-mono text-sm text-hl-green-900">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="rounded border border-hl-green-900 px-2 font-mono text-sm text-hl-green-900"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="ml-auto font-mono text-xs text-hl-stamp"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                  <span className="font-mono text-sm text-hl-green-900">
                    {formatPrice(item.line_total_cents)}&nbsp;€
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2 border-t border-hl-cream pt-4">
              <div className="flex justify-between font-mono text-sm text-hl-green-700">
                <span>Subtotal</span>
                <span>{formatPrice(cart.subtotal_cents)}&nbsp;€</span>
              </div>
              <div className="flex justify-between font-mono text-sm text-hl-green-700">
                <span>Envío</span>
                <span>{formatPrice(cart.shipping_cents)}&nbsp;€</span>
              </div>
              <div className="flex justify-between font-mono text-base font-medium text-hl-green-900">
                <span>Total</span>
                <span>{formatPrice(cart.total_cents)}&nbsp;€</span>
              </div>
              <Link
                href="/checkout"
                className="mt-2 rounded-md bg-hl-green-900 px-4 py-2 text-center font-body text-sm font-medium text-hl-bone"
              >
                Finalizar compra
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
