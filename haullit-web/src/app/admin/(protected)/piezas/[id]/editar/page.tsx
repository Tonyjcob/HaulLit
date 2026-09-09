import { notFound } from "next/navigation";
import { getAdminProduct } from "@/lib/admin-api";
import ProductForm from "@/components/ProductForm";

export default async function EditarPiezaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getAdminProduct(Number(id));

  if (!product) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl uppercase text-hl-green-900">
        Editar pieza
      </h1>
      <ProductForm product={product} />
    </div>
  );
}
