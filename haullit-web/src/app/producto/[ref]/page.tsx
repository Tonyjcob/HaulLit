import { notFound } from "next/navigation";
import { getProduct } from "@/lib/api";
import ProductGallery from "@/components/ProductGallery";
import ProductPurchasePanel from "@/components/ProductPurchasePanel";

export default async function ProductoPage({
  params,
}: {
  params: Promise<{ ref: string }>;
}) {
  const { ref } = await params;
  const product = await getProduct(ref);

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto grid w-full max-w-5xl flex-1 grid-cols-1 gap-10 px-6 py-12 sm:grid-cols-2">
      <ProductGallery photos={product.photos} alt={product.name} />
      <ProductPurchasePanel product={product} />
    </main>
  );
}
