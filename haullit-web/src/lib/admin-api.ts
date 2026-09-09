const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type CodeStatus = "active" | "revoked";

export type AdminCode = {
  id: number;
  code: string;
  status: CodeStatus;
  email: string | null;
  created_at: string;
  last_seen_at: string | null;
};

export async function getAdminCodes(): Promise<AdminCode[]> {
  const res = await fetch(`${API_URL}/admin/codes`, { cache: "no-store" });
  if (!res.ok) throw new Error("No se pudieron cargar los códigos");
  return res.json();
}
