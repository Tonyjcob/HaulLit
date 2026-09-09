"use client";

import { useState } from "react";
import type { Cart, CheckoutResult, PaymentMethod } from "@/lib/api";
import { CART_UPDATED_EVENT } from "@/components/CartWidget";

function formatPrice(cents: number): string {
  return (cents / 100).toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function CheckoutForm({
  cart,
  prefillEmail,
}: {
  cart: Cart;
  prefillEmail: string | null;
}) {
  const [email, setEmail] = useState(prefillEmail ?? "");
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [cp, setCp] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("transferencia");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CheckoutResult | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        shipping_address: { nombre, direccion, ciudad, cp },
        payment_method: paymentMethod,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "No se pudo completar el pedido");
      return;
    }

    setResult(data);
    window.dispatchEvent(new Event(CART_UPDATED_EVENT));
  }

  if (result) {
    const { payment } = result;
    return (
      <div className="flex flex-col gap-4">
        <p className="font-body text-base text-hl-green-900">
          Pedido confirmado — número{" "}
          <span className="font-mono">{payment.reference}</span>
        </p>
        <p className="font-body text-sm text-hl-green-700">
          Total a pagar: {formatPrice(result.total_cents)}&nbsp;€
        </p>

        {payment.method === "transferencia" ? (
          <div className="flex flex-col gap-1 rounded-md bg-hl-cream p-4 font-mono text-sm text-hl-green-900">
            <span>Transferencia bancaria a:</span>
            <span>IBAN: {payment.iban}</span>
            <span>Titular: {payment.holder}</span>
            <span>Concepto: {payment.reference}</span>
          </div>
        ) : (
          <div className="flex flex-col gap-1 rounded-md bg-hl-cream p-4 font-mono text-sm text-hl-green-900">
            <span>Bizum al número:</span>
            <span>{payment.phone}</span>
            <span>Concepto: {payment.reference}</span>
          </div>
        )}

        <p className="font-body text-sm text-hl-green-700">
          Tu pedido queda pendiente hasta que confirmemos el pago.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 rounded-md border border-hl-cream p-4">
        {cart.items.map((item) => (
          <div key={item.id} className="flex justify-between font-mono text-sm text-hl-green-900">
            <span>
              {item.name} ({item.size}) ×{item.quantity}
            </span>
            <span>{formatPrice(item.line_total_cents)}&nbsp;€</span>
          </div>
        ))}
        <div className="mt-2 flex justify-between border-t border-hl-cream pt-2 font-mono text-sm text-hl-green-700">
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
      </div>

      <div className="flex flex-col gap-3">
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-md border border-hl-cream bg-white px-3 py-2 font-body text-sm text-hl-green-900 outline-none focus:border-hl-green-700"
        />
        <input
          type="text"
          required
          placeholder="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="rounded-md border border-hl-cream bg-white px-3 py-2 font-body text-sm text-hl-green-900 outline-none focus:border-hl-green-700"
        />
        <input
          type="text"
          required
          placeholder="Dirección"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          className="rounded-md border border-hl-cream bg-white px-3 py-2 font-body text-sm text-hl-green-900 outline-none focus:border-hl-green-700"
        />
        <div className="flex gap-3">
          <input
            type="text"
            required
            placeholder="Ciudad"
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
            className="flex-1 rounded-md border border-hl-cream bg-white px-3 py-2 font-body text-sm text-hl-green-900 outline-none focus:border-hl-green-700"
          />
          <input
            type="text"
            required
            placeholder="Código postal"
            value={cp}
            onChange={(e) => setCp(e.target.value)}
            className="w-32 rounded-md border border-hl-cream bg-white px-3 py-2 font-body text-sm text-hl-green-900 outline-none focus:border-hl-green-700"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-body text-sm text-hl-green-700">Pago</span>
        <label className="flex items-center gap-2 font-body text-sm text-hl-green-900">
          <input
            type="radio"
            name="payment_method"
            checked={paymentMethod === "transferencia"}
            onChange={() => setPaymentMethod("transferencia")}
          />
          Transferencia bancaria
        </label>
        <label className="flex items-center gap-2 font-body text-sm text-hl-green-900">
          <input
            type="radio"
            name="payment_method"
            checked={paymentMethod === "bizum"}
            onChange={() => setPaymentMethod("bizum")}
          />
          Bizum
        </label>
      </div>

      {error && <p className="font-body text-sm text-hl-stamp">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-hl-green-900 px-4 py-2 font-body text-sm font-medium text-hl-bone disabled:opacity-50"
      >
        {loading ? "Confirmando…" : "Confirmar pedido"}
      </button>
    </form>
  );
}
