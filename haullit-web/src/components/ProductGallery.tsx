"use client";

import { useState } from "react";

export default function ProductGallery({
  photos,
  alt,
}: {
  photos: string[];
  alt: string;
}) {
  const [index, setIndex] = useState(0);

  function prev() {
    setIndex((i) => (i === 0 ? photos.length - 1 : i - 1));
  }

  function next() {
    setIndex((i) => (i === photos.length - 1 ? 0 : i + 1));
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-hl-cream">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photos[index]}
          alt={alt}
          className="h-full w-full object-cover"
        />

        {photos.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Foto anterior"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-hl-green-900/80 px-3 py-2 font-body text-hl-bone"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Foto siguiente"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-hl-green-900/80 px-3 py-2 font-body text-hl-bone"
            >
              ›
            </button>
          </>
        )}
      </div>

      {photos.length > 1 && (
        <div className="flex gap-2">
          {photos.map((photo, i) => (
            <button
              key={photo}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Ver foto ${i + 1}`}
              className={`h-2 w-2 rounded-full ${
                i === index ? "bg-hl-green-900" : "bg-hl-cream"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
