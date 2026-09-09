import type { OrderHistory, OrderStatus } from "@/lib/api";

function formatPrice(cents: number): string {
  return (cents / 100).toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Pendiente de pago",
  paid: "Pagado",
  shipped: "Enviado",
  cancelled: "Cancelado",
};

export default function OrderHistoryList({ orders }: { orders: OrderHistory[] }) {
  if (orders.length === 0) {
    return (
      <p className="font-body text-sm text-hl-green-700">
        Todavía no has hecho ningún pedido.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {orders.map((order) => (
        <div
          key={order.id}
          className="flex flex-col gap-2 rounded-md border border-hl-cream p-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-sm text-hl-green-900">
              {order.payment_reference}
            </span>
            <span className="font-mono text-xs text-hl-green-700">
              {formatDate(order.created_at)}
            </span>
            <span className="rounded bg-hl-cream px-2 py-1 font-mono text-xs text-hl-green-900">
              {STATUS_LABEL[order.status]}
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
          </div>

          <div className="flex justify-between border-t border-hl-cream pt-2 font-mono text-sm font-medium text-hl-green-900">
            <span>Total</span>
            <span>{formatPrice(order.total_cents)}&nbsp;€</span>
          </div>
        </div>
      ))}
    </div>
  );
}
