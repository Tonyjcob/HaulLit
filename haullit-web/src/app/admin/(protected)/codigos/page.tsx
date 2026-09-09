import { getAdminCodes } from "@/lib/admin-api";
import CodesTable from "@/components/CodesTable";

export default async function AdminCodigosPage() {
  const codes = await getAdminCodes();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl uppercase text-hl-green-900">
        Códigos
      </h1>
      <CodesTable initialCodes={codes} />
    </div>
  );
}
