import type { Product } from "@/lib/api";
import { stockTotal } from "@/lib/api";

const ULTIMAS_UNIDADES_MAX = 2;

function formatPrice(cents: number): string {
  return (cents / 100).toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function ProductCard({ product }: { product: Product }) {
  const stock = stockTotal(product);
  const agotado = stock === 0;
  const ultimasUnidades = !agotado && stock <= ULTIMAS_UNIDADES_MAX;

  return (
    <div className="flex flex-col gap-2">
      <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-hl-cream">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.photos[0]}
          alt={product.name}
          className={`h-full w-full object-cover ${agotado ? "opacity-50" : ""}`}
        />
        {agotado && (
          <span className="absolute left-2 top-2 rounded bg-hl-green-900 px-2 py-1 font-mono text-xs text-hl-bone">
            Vendido
          </span>
        )}
        {ultimasUnidades && (
          <span className="absolute left-2 top-2 rounded bg-hl-stamp px-2 py-1 font-mono text-xs text-hl-bone">
            Últimas unidades
          </span>
        )}
      </div>

      <span className="font-mono text-xs text-hl-green-700">{product.ref}</span>
      <span
        className={`font-body text-sm text-hl-green-900 ${agotado ? "line-through opacity-60" : ""}`}
      >
        {product.name}
      </span>
      <span className="font-mono text-sm font-medium text-hl-green-900">
        {formatPrice(product.price_cents)}&nbsp;€
      </span>
    </div>
  );
}
