"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AccesoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const revocado = searchParams.get("revocado") === "1";

  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/acceso", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Código inválido");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-24">
      <h1 className="font-display text-4xl uppercase tracking-wide text-hl-green-900">
        HaulLit
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-xs flex-col gap-3"
      >
        <label htmlFor="code" className="font-body text-sm text-hl-green-700">
          Introduce tu código
        </label>
        <input
          id="code"
          name="code"
          type="text"
          autoComplete="off"
          autoCapitalize="characters"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="HL-XXXX-XXXX"
          className="rounded-md border border-hl-cream bg-white px-3 py-2 font-mono text-sm text-hl-green-900 outline-none focus:border-hl-green-700"
        />

        {revocado && !error && (
          <p className="font-body text-sm text-hl-stamp">
            Este código ya no es válido.
          </p>
        )}
        {error && <p className="font-body text-sm text-hl-stamp">{error}</p>}

        <button
          type="submit"
          disabled={loading || code.trim() === ""}
          className="rounded-md bg-hl-green-900 px-3 py-2 font-body text-sm font-medium text-hl-bone disabled:opacity-50"
        >
          {loading ? "Comprobando…" : "Entrar"}
        </button>
      </form>
    </main>
  );
}
