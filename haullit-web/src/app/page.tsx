import Link from "next/link";
import { getCategorias, getProducts, type Orden } from "@/lib/api";
import ProductFilters from "@/components/ProductFilters";
import ProductCard from "@/components/ProductCard";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; orden?: string }>;
}) {
  const params = await searchParams;
  const categoria = params.categoria;
  const orden = (params.orden as Orden) ?? "recientes";

  const [products, categorias] = await Promise.all([
    getProducts({ categoria, orden }),
    getCategorias(),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-12">
      <h1 className="font-display text-4xl uppercase tracking-wide text-hl-green-900">
        HaulLit
      </h1>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <ProductFilters categorias={categorias} />
        <span className="font-mono text-sm text-hl-green-700">
          {products.length}{" "}
          {products.length === 1 ? "resultado" : "resultados"}
        </span>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-24 text-center">
          <p className="font-body text-base text-hl-green-700">
            No hay piezas que coincidan con este filtro.
          </p>
          <Link
            href="/"
            className="rounded-md bg-hl-green-900 px-4 py-2 font-body text-sm font-medium text-hl-bone"
          >
            Quitar filtro
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
