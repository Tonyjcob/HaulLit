import { redirect } from "next/navigation";
import { getCart, getCodeEmail } from "@/lib/api";
import { getSessionCodeIdFromCookies } from "@/lib/session";
import CheckoutForm from "@/components/CheckoutForm";

export default async function CheckoutPage() {
  const codeId = await getSessionCodeIdFromCookies();
  if (codeId === null) {
    redirect("/acceso");
  }

  const [cart, email] = await Promise.all([
    getCart(codeId),
    getCodeEmail(codeId),
  ]);

  if (cart.items.length === 0) {
    redirect("/");
  }

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-12">
      <h1 className="font-display text-3xl uppercase text-hl-green-900">
        Checkout
      </h1>
      <CheckoutForm cart={cart} prefillEmail={email} />
    </main>
  );
}
