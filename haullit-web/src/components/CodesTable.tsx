"use client";

import { useState } from "react";
import type { AdminCode } from "@/lib/admin-api";

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function CodesTable({ initialCodes }: { initialCodes: AdminCode[] }) {
  const [codes, setCodes] = useState(initialCodes);
  const [creating, setCreating] = useState(false);

  async function handleCreate() {
    setCreating(true);
    const res = await fetch("/api/admin/codigos", { method: "POST" });
    setCreating(false);
    if (res.ok) {
      const newCode: AdminCode = await res.json();
      setCodes((prev) => [newCode, ...prev]);
    }
  }

  async function toggleStatus(code: AdminCode) {
    const nextStatus = code.status === "active" ? "revoked" : "active";
    const res = await fetch(`/api/admin/codigos/${code.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    if (res.ok) {
      const updated: AdminCode = await res.json();
      setCodes((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={handleCreate}
        disabled={creating}
        className="w-fit rounded-md bg-hl-green-900 px-4 py-2 font-body text-sm font-medium text-hl-bone disabled:opacity-50"
      >
        {creating ? "Creando…" : "Crear código"}
      </button>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-left font-mono text-sm">
          <thead>
            <tr className="border-b border-hl-cream text-hl-green-700">
              <th className="py-2 pr-4">Código</th>
              <th className="py-2 pr-4">Estado</th>
              <th className="py-2 pr-4">Email</th>
              <th className="py-2 pr-4">Última actividad</th>
              <th className="py-2 pr-4"></th>
            </tr>
          </thead>
          <tbody>
            {codes.map((code) => (
              <tr key={code.id} className="border-b border-hl-cream text-hl-green-900">
                <td className="py-2 pr-4">{code.code}</td>
                <td className="py-2 pr-4">
                  <span
                    className={
                      code.status === "active" ? "text-hl-green-700" : "text-hl-stamp"
                    }
                  >
                    {code.status === "active" ? "Activo" : "Revocado"}
                  </span>
                </td>
                <td className="py-2 pr-4">{code.email ?? "—"}</td>
                <td className="py-2 pr-4">{formatDate(code.last_seen_at)}</td>
                <td className="py-2 pr-4">
                  <button
                    type="button"
                    onClick={() => toggleStatus(code)}
                    className="text-xs underline text-hl-green-700"
                  >
                    {code.status === "active" ? "Revocar" : "Reactivar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
