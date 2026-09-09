import { redirect } from "next/navigation";
import { getCodeContact, getOrders } from "@/lib/api";
import { getSessionCodeIdFromCookies } from "@/lib/session";
import AccountForm from "@/components/AccountForm";
import OrderHistoryList from "@/components/OrderHistoryList";

export default async function CuentaPage() {
  const codeId = await getSessionCodeIdFromCookies();
  if (codeId === null) {
    redirect("/acceso");
  }

  const [contact, orders] = await Promise.all([
    getCodeContact(codeId),
    getOrders(codeId),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-10 px-6 py-12">
      <section className="flex flex-col gap-4">
        <h1 className="font-display text-3xl uppercase text-hl-green-900">
          Mi cuenta
        </h1>
        <AccountForm contact={contact} />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-xl uppercase text-hl-green-900">
          Mis pedidos
        </h2>
        <OrderHistoryList orders={orders} />
      </section>
    </main>
  );
}
