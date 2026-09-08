export default function Loading() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-12">
      <div className="h-10 w-40 animate-pulse rounded bg-hl-cream" />

      <div className="flex justify-between gap-3">
        <div className="h-10 w-80 animate-pulse rounded bg-hl-cream" />
        <div className="h-10 w-24 animate-pulse rounded bg-hl-cream" />
      </div>

      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="aspect-[4/5] animate-pulse rounded-md bg-hl-cream" />
            <div className="h-3 w-16 animate-pulse rounded bg-hl-cream" />
            <div className="h-4 w-32 animate-pulse rounded bg-hl-cream" />
            <div className="h-4 w-12 animate-pulse rounded bg-hl-cream" />
          </div>
        ))}
      </div>
    </main>
  );
}
