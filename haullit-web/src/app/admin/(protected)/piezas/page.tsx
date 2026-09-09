import Link from "next/link";
import { getAdminProducts } from "@/lib/admin-api";
import PiezasTable from "@/components/PiezasTable";

export default async function AdminPiezasPage() {
  const products = await getAdminProducts();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl uppercase text-hl-green-900">
          Piezas
        </h1>
        <Link
          href="/admin/piezas/nueva"
          className="rounded-md bg-hl-green-900 px-4 py-2 font-body text-sm font-medium text-hl-bone"
        >
          Crear pieza
        </Link>
      </div>
      <PiezasTable initialProducts={products} />
    </div>
  );
}
