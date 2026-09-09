"use client";

import { useState } from "react";
import type { AdminOrder, OrderStatus } from "@/lib/admin-api";

function formatPrice(cents: number): string {
  return (cents / 100).toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "pending", label: "Pendiente de pago" },
  { value: "paid", label: "Pagado" },
  { value: "shipped", label: "Enviado" },
  { value: "cancelled", label: "Cancelado" },
];

export default function PedidosTable({ initialOrders }: { initialOrders: AdminOrder[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [errorFor, setErrorFor] = useState<number | null>(null);

  async function handleStatusChange(order: AdminOrder, status: OrderStatus) {
    setErrorFor(null);
    const res = await fetch(`/api/admin/pedidos/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      const updated: AdminOrder = await res.json();
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
    } else {
      setErrorFor(order.id);
    }
  }

  if (orders.length === 0) {
    return (
      <p className="font-body text-sm text-hl-green-700">
        Todavía no hay pedidos.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {orders.map((order) => (
        <div
          key={order.id}
          className="flex flex-col gap-3 rounded-md border border-hl-cream p-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-col">
              <span className="font-mono text-sm text-hl-green-900">
                {order.payment_reference}
              </span>
              <span className="font-mono text-xs text-hl-green-700">
                {order.code} · {formatDate(order.created_at)}
              </span>
            </div>
            <select
              value={order.status}
              onChange={(e) =>
                handleStatusChange(order, e.target.value as OrderStatus)
              }
              className="rounded-md border border-hl-cream bg-white px-3 py-2 font-mono text-sm text-hl-green-900"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {errorFor === order.id && (
            <p className="font-body text-sm text-hl-stamp">
              No se pudo actualizar el pedido.
            </p>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1 font-body text-sm text-hl-green-700">
              <span>{order.email_snapshot}</span>
              <span>{order.shipping_address_snapshot.nombre}</span>
              <span>{order.shipping_address_snapshot.direccion}</span>
              <span>
                {order.shipping_address_snapshot.ciudad}, {order.shipping_address_snapshot.cp}
              </span>
              <span className="font-mono text-xs">
                Pago: {order.payment_method}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              {order.items.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between font-body text-sm text-hl-green-700"
                >
                  <span>
                    {item.name} ({item.size}) ×{item.quantity}
                  </span>
                  <span className="font-mono">
                    {formatPrice(item.price_cents * item.quantity)}&nbsp;€
                  </span>
                </div>
              ))}
              <div className="flex justify-between border-t border-hl-cream pt-1 font-mono text-sm font-medium text-hl-green-900">
                <span>Total</span>
                <span>{formatPrice(order.total_cents)}&nbsp;€</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
