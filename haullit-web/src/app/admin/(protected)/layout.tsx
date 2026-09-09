import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminSessionIdFromCookies } from "@/lib/admin-session";
import AdminLogoutButton from "@/components/AdminLogoutButton";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adminId = await getAdminSessionIdFromCookies();
  if (adminId === null) {
    redirect("/admin/login");
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-hl-cream px-6 py-4">
        <div className="flex items-center gap-6">
          <span className="font-display text-xl uppercase tracking-wide text-hl-green-900">
            Admin
          </span>
          <nav className="flex gap-4 font-mono text-sm text-hl-green-900">
            <Link href="/admin/codigos">Códigos</Link>
            <Link href="/admin/piezas">Piezas</Link>
          </nav>
        </div>
        <AdminLogoutButton />
      </header>
      <main className="flex flex-1 flex-col px-6 py-12">{children}</main>
    </div>
  );
}
