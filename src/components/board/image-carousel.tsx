"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Images } from "lucide-react";
import { useState } from "react";

export function ImageCarousel({ images, title }: { images: string[]; title: string }) {
  const uniqueImages = [...new Set(images.filter(Boolean))];
  const [start, setStart] = useState(0);
  if (!uniqueImages.length) return null;
  const carousel = uniqueImages.length > 3;
  const visible = carousel ? Array.from({ length: 3 }, (_, offset) => uniqueImages[(start + offset) % uniqueImages.length]) : uniqueImages;

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
      <div className="flex items-center justify-between gap-4">
        <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-300"><Images className="size-4" /> Image evidence <span className="text-slate-500">({uniqueImages.length})</span></h2>
        {carousel && <div className="flex gap-2"><button type="button" onClick={() => setStart((current) => (current - 1 + uniqueImages.length) % uniqueImages.length)} className="grid size-8 place-items-center rounded-md border border-slate-700 text-amber-300 hover:border-amber-400" aria-label="Previous images"><ChevronLeft className="size-4" /></button><button type="button" onClick={() => setStart((current) => (current + 1) % uniqueImages.length)} className="grid size-8 place-items-center rounded-md border border-slate-700 text-amber-300 hover:border-amber-400" aria-label="Next images"><ChevronRight className="size-4" /></button></div>}
      </div>
      <div className={`mt-4 grid gap-3 ${visible.length === 1 ? "grid-cols-1" : visible.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
        {visible.map((source, index) => <a key={`${source}-${index}`} href={source} target="_blank" rel="noreferrer" className="group relative aspect-square overflow-hidden rounded-lg border border-slate-700 bg-black"><Image src={source} alt={`${title} evidence ${start + index + 1}`} fill sizes="(max-width: 768px) 33vw, 220px" unoptimized className="object-cover transition duration-300 group-hover:scale-105" /></a>)}
      </div>
      {carousel && <div className="mt-4 flex justify-center gap-1.5">{uniqueImages.map((_, index) => <button key={index} type="button" onClick={() => setStart(index)} aria-label={`Show image ${index + 1}`} className={`h-1.5 rounded-full transition-all ${index === start ? "w-6 bg-amber-300" : "w-1.5 bg-slate-700"}`} />)}</div>}
    </section>
  );
}
