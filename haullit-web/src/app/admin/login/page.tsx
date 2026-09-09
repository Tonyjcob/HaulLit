"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Credenciales inválidas");
      return;
    }

    router.push("/admin/codigos");
    router.refresh();
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-24">
      <h1 className="font-display text-3xl uppercase tracking-wide text-hl-green-900">
        Admin
      </h1>

      <form onSubmit={handleSubmit} className="flex w-full max-w-xs flex-col gap-3">
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-md border border-hl-cream bg-white px-3 py-2 font-body text-sm text-hl-green-900 outline-none focus:border-hl-green-700"
        />
        <input
          type="password"
          required
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-md border border-hl-cream bg-white px-3 py-2 font-body text-sm text-hl-green-900 outline-none focus:border-hl-green-700"
        />

        {error && <p className="font-body text-sm text-hl-stamp">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-hl-green-900 px-3 py-2 font-body text-sm font-medium text-hl-bone disabled:opacity-50"
        >
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </main>
  );
}
