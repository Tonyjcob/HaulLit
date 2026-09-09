"use client";

import { useCallback, useEffect, useState } from "react";
import type { Cart } from "@/lib/api";
import CartDrawer from "@/components/CartDrawer";

export const CART_UPDATED_EVENT = "cart:updated";

export default function CartWidget() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [open, setOpen] = useState(false);

  const fetchCart = useCallback(async () => {
    const res = await fetch("/api/carrito");
    if (res.ok) {
      setCart(await res.json());
    }
  }, []);

  useEffect(() => {
    fetchCart();
    window.addEventListener(CART_UPDATED_EVENT, fetchCart);
    return () => window.removeEventListener(CART_UPDATED_EVENT, fetchCart);
  }, [fetchCart]);

  const itemCount =
    cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 font-mono text-sm text-hl-green-900"
        aria-label="Abrir carrito"
      >
        Carrito
        {itemCount > 0 && (
          <span className="rounded-full bg-hl-green-900 px-2 py-0.5 text-xs text-hl-bone">
            {itemCount}
          </span>
        )}
      </button>

      {open && (
        <CartDrawer
          cart={cart}
          onClose={() => setOpen(false)}
          onCartChange={setCart}
        />
      )}
    </>
  );
}
