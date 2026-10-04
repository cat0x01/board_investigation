"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, FilePlus2, ShieldCheck } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const links = [
    { href: "/cases", label: "Cases", icon: Briefcase },
    { href: "/cases#create-case", label: "Add Case", icon: FilePlus2 },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-amber-400/10 bg-[#050505]/95 backdrop-blur-xl lg:block">
      <Link href="/cases" className="flex h-20 items-center gap-3 border-b border-amber-400/10 px-4">
        <div className="grid size-12 place-items-center rounded-full border border-amber-400/25 bg-black shadow-[0_0_25px_rgba(250,204,21,.1)]">
          <Image src="/logo.png" alt="CAT0X01" width={42} height={42} className="size-10 rounded-full object-cover" priority />
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-wide text-white">CAT0X01 Investigation</div>
          <div className="mt-1 font-mono text-[9px] uppercase tracking-[.16em] text-amber-400">Intelligence System</div>
        </div>
      </Link>
      <nav className="space-y-2 p-4">
        <div className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[.2em] text-slate-600">Workspace</div>
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === "/cases" && label === "Cases";
          return <Link key={label} href={href} className={`flex h-11 items-center gap-3 rounded px-3 text-sm transition ${active ? "border-r-2 border-amber-300 bg-gradient-to-r from-amber-400/[.07] to-transparent text-white" : "text-stone-500 hover:bg-amber-400/[.03] hover:text-white"}`}><Icon className={`size-4 ${active ? "text-amber-300" : ""}`} />{label}</Link>;
        })}
      </nav>
      <div className="absolute inset-x-4 bottom-5 rounded border border-amber-400/20 bg-black/70 p-4">
        <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[.15em] text-stone-500"><ShieldCheck className="size-4 text-amber-300" /> System status</div>
        <p className="mt-2 flex items-center gap-2 font-mono text-xs font-bold uppercase text-amber-300"><span className="size-2 rounded-full bg-amber-300 shadow-[0_0_8px_#facc15]" /> Secure</p>
      </div>
    </aside>
  );
}
