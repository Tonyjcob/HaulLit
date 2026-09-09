import ProductForm from "@/components/ProductForm";

export default function NuevaPiezaPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl uppercase text-hl-green-900">
        Crear pieza
      </h1>
      <ProductForm />
    </div>
  );
}
