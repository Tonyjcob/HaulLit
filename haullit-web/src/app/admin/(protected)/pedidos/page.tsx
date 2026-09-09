import { getAdminOrders } from "@/lib/admin-api";
import PedidosTable from "@/components/PedidosTable";

export default async function AdminPedidosPage() {
  const orders = await getAdminOrders();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl uppercase text-hl-green-900">
        Pedidos
      </h1>
      <PedidosTable initialOrders={orders} />
    </div>
  );
}
