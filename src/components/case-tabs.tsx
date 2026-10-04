import Link from "next/link";
import { ArrowLeft, Network, NotebookPen } from "lucide-react";

export function CaseTabs({ caseId, active }: { caseId: string; active: string }) {
  const tabs = [{ key: "board", label: "Board", icon: Network }, { key: "notes", label: "Notes", icon: NotebookPen }];
  return <div className="flex flex-wrap gap-2"><Link href="/cases" className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-800 px-3 text-sm text-slate-400"><ArrowLeft className="size-4" /> Cases</Link>{tabs.map(tab => { const Icon = tab.icon; return <Link key={tab.key} href={`/cases/${caseId}/${tab.key}`} className={`inline-flex h-10 items-center gap-2 rounded-lg border px-3 text-sm ${active === tab.key ? "border-amber-400/40 bg-amber-400/10 text-amber-100" : "border-slate-800 text-slate-400"}`}><Icon className="size-4" />{tab.label}</Link>; })}</div>;
}
