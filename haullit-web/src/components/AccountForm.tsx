"use client";

import { useState } from "react";
import type { CodeContact } from "@/lib/api";

export default function AccountForm({ contact }: { contact: CodeContact | null }) {
  const [email, setEmail] = useState(contact?.email ?? "");
  const [nombre, setNombre] = useState(contact?.shipping_address?.nombre ?? "");
  const [direccion, setDireccion] = useState(
    contact?.shipping_address?.direccion ?? "",
  );
  const [ciudad, setCiudad] = useState(contact?.shipping_address?.ciudad ?? "");
  const [cp, setCp] = useState(contact?.shipping_address?.cp ?? "");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    const res = await fetch("/api/cuenta", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        shipping_address: { nombre, direccion, ciudad, cp },
      }),
    });

    setStatus(res.ok ? "done" : "error");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="email"
        required
        placeholder="Email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setStatus("idle");
        }}
        className="rounded-md border border-hl-cream bg-white px-3 py-2 font-body text-sm text-hl-green-900 outline-none focus:border-hl-green-700"
      />
      <input
        type="text"
        placeholder="Nombre completo"
        value={nombre}
        onChange={(e) => {
          setNombre(e.target.value);
          setStatus("idle");
        }}
        className="rounded-md border border-hl-cream bg-white px-3 py-2 font-body text-sm text-hl-green-900 outline-none focus:border-hl-green-700"
      />
      <input
        type="text"
        placeholder="Dirección"
        value={direccion}
        onChange={(e) => {
          setDireccion(e.target.value);
          setStatus("idle");
        }}
        className="rounded-md border border-hl-cream bg-white px-3 py-2 font-body text-sm text-hl-green-900 outline-none focus:border-hl-green-700"
      />
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Ciudad"
          value={ciudad}
          onChange={(e) => {
            setCiudad(e.target.value);
            setStatus("idle");
          }}
          className="flex-1 rounded-md border border-hl-cream bg-white px-3 py-2 font-body text-sm text-hl-green-900 outline-none focus:border-hl-green-700"
        />
        <input
          type="text"
          placeholder="Código postal"
          value={cp}
          onChange={(e) => {
            setCp(e.target.value);
            setStatus("idle");
          }}
          className="w-32 rounded-md border border-hl-cream bg-white px-3 py-2 font-body text-sm text-hl-green-900 outline-none focus:border-hl-green-700"
        />
      </div>

      {status === "error" && (
        <p className="font-body text-sm text-hl-stamp">
          No se pudo guardar, inténtalo de nuevo.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-fit rounded-md bg-hl-green-900 px-4 py-2 font-body text-sm font-medium text-hl-bone disabled:opacity-50"
      >
        {status === "loading"
          ? "Guardando…"
          : status === "done"
            ? "Guardado ✓"
            : "Guardar"}
      </button>
    </form>
  );
}
