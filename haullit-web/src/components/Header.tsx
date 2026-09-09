"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import CartWidget from "@/components/CartWidget";

export default function Header() {
  const pathname = usePathname();

  if (pathname === "/acceso" || pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="flex items-center justify-between border-b border-hl-cream px-6 py-4">
      <Link
        href="/"
        className="font-display text-2xl uppercase tracking-wide text-hl-green-900"
      >
        HaulLit
      </Link>
      <div className="flex items-center gap-4">
        <Link href="/cuenta" className="font-mono text-sm text-hl-green-900">
          Mi cuenta
        </Link>
        <CartWidget />
      </div>
    </header>
  );
}
