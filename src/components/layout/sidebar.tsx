"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
<<<<<<< HEAD
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
=======
import { BarChart3, Bell, BookOpen, Briefcase, FileArchive, FileText, FolderKanban, LayoutDashboard, Link2, NotebookPen, Settings, Tags, UserRound, UsersRound, type LucideIcon } from "lucide-react";
import { clsx } from "clsx";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/cases", label: "Cases", icon: Briefcase },
  { href: "/cases", label: "Case Board", icon: FolderKanban },
  { href: "/cases", label: "Evidence", icon: FileArchive },
  { href: "/cases", label: "Timeline", icon: BookOpen },
  { href: "/cases", label: "Persons", icon: UsersRound },
  { href: "/cases", label: "Notes", icon: NotebookPen },
  { href: "/settings", label: "Reports", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-slate-800/80 bg-black/45 backdrop-blur-xl lg:block">
      <div className="flex h-20 items-center gap-3 border-b border-slate-800/80 px-6">
        <div className="grid size-12 place-items-center rounded-full border border-amber-300/50 bg-blue-950 shadow-[0_0_28px_rgba(251,191,36,0.14)]">
          <FbiSealLogo />
        </div>
        <div>
          <div className="text-base font-bold text-white">CAT0X01 INVESTIGATIOONS</div>
          <div className="text-xs text-slate-400">Investigation Workspace</div>
        </div>
      </div>
      <nav className="space-y-6 p-4">
        <div>
          <div className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Main</div>
          <div className="space-y-1">
            {nav.slice(0, 7).map((item) => <NavItem key={item.label} item={item} active={pathname === item.href || (item.label === "Case Board" && pathname.includes("/board")) || (item.label === "Evidence" && pathname.includes("/evidence")) || (item.label === "Timeline" && pathname.includes("/timeline")) || (item.label === "Persons" && pathname.includes("/persons")) || (item.label === "Notes" && pathname.includes("/notes"))} />)}
          </div>
        </div>
        <div>
          <div className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Case Tools</div>
          <div className="space-y-1">
            {[
              { href: "/cases", label: "Tags", icon: Tags },
              { href: "/cases", label: "Files", icon: FileText },
              { href: "/cases", label: "Links", icon: Link2 }
            ].map((item) => <NavItem key={item.label} item={item} active={false} />)}
          </div>
        </div>
        <div>
          <div className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Admin</div>
          <div className="space-y-1">
            <NavItem item={{ href: "/settings", label: "Users", icon: UserRound }} active={pathname === "/settings"} />
            <NavItem item={{ href: "/settings", label: "Audit Log", icon: Bell }} active={false} />
          </div>
        </div>
      </nav>
    </aside>
  );
}

function FbiSealLogo() {
  return (
    <Image src="/logo.png" alt="CAT0X01 logo" width={40} height={40} className="size-10 rounded-full object-cover" priority />
  );
}

function NavItem({ item, active }: { item: { href: string; label: string; icon: LucideIcon }; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link href={item.href} className={clsx("flex h-11 items-center gap-3 rounded-md px-3 text-sm transition", active ? "bg-slate-800/90 text-white" : "text-slate-400 hover:bg-slate-900/80 hover:text-slate-100")}>
      <Icon className="size-4" />
      {item.label}
    </Link>
  );
}
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
