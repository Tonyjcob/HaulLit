export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <h1 className="font-display text-6xl uppercase tracking-wide text-hl-green-900">
        HaulLit
      </h1>
      <p className="max-w-md font-body text-base text-hl-green-700">
        Streetwear de resale, curado a mano. Fase 1 — setup del
        proyecto.
      </p>
      <div className="flex items-center gap-4 rounded-md bg-hl-cream px-4 py-2">
        <span className="font-mono text-sm text-hl-green-900">
          HL-26-014
        </span>
        <span className="font-mono text-sm font-medium text-hl-stamp">
          45,00&nbsp;€
        </span>
      </div>
    </main>
  );
}
