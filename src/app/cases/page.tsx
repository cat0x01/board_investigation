import Link from "next/link";
<<<<<<< HEAD
import { Activity, AlertTriangle, Archive, BookOpen, FileText, Folder, Network, Pencil, Plus } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { CaseDeleteButton } from "@/components/case-delete-button";
import { CaseForm } from "@/components/forms/case-form";
import { GenerateReportButton } from "@/components/generate-report-button";
import { getCurrentUserFromCookies, readableCaseWhere } from "@/lib/current-user";
=======
import { Plus, Trash2 } from "lucide-react";
import { CaseDeleteButton } from "@/components/case-delete-button";
import { AppShell } from "@/components/layout/app-shell";
import { CaseForm } from "@/components/forms/case-form";
import { getCurrentUserFromCookies, publicUserSelect, readableCaseWhere } from "@/lib/current-user";
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
import { prisma } from "@/lib/db/prisma";
import { formatDate, priorityTone } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function CasesPage() {
<<<<<<< HEAD
  const user = await getCurrentUserFromCookies();
  const cases = await prisma.case.findMany({ where: readableCaseWhere(user.id), orderBy: { updatedAt: "desc" }, include: { _count: { select: { nodes: true, notes: true } } } });
  const active = cases.filter((item) => item.status === "Active").length;
  const closed = cases.filter((item) => item.status === "Closed" || item.status === "Archived").length;
  const urgent = cases.filter((item) => item.priority === "Critical" || item.priority === "High").length;
  const stats = [
    { label: "Total cases", value: cases.length, icon: Folder },
    { label: "Active cases", value: active, icon: Activity },
    { label: "Closed cases", value: closed, icon: Archive },
    { label: "High priority", value: urgent, icon: AlertTriangle }
  ];

  return <AppShell><div className="cases-command min-h-[calc(100vh-5rem)] px-4 py-7 lg:px-7 xl:px-8">
    <div className="mx-auto max-w-[1680px]">
      <header className="flex flex-wrap items-end justify-between gap-5">
        <div><div className="font-mono text-xs font-bold uppercase tracking-[.22em] text-amber-400">Secure case registry</div><h1 className="mt-3 text-3xl font-bold uppercase tracking-tight text-white">Investigation Cases</h1><p className="mt-2 text-sm text-stone-500">Open a case board, maintain notes, or generate a complete intelligence report.</p></div>
        <Link href="#create-case" className="inline-flex h-11 items-center gap-2 rounded-md border border-amber-200/50 bg-gradient-to-b from-amber-300 to-amber-500 px-5 font-mono text-xs font-bold uppercase tracking-[.1em] text-black shadow-[0_0_24px_rgba(250,204,21,.12)] hover:brightness-110"><Plus className="size-4" /> Add Case</Link>
      </header>

      <div className="mt-7 grid items-start gap-7 min-[1750px]:grid-cols-[minmax(0,1fr)_420px]">
        <div className="min-w-0">
          <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {stats.map(({ label, value, icon: Icon }) => <div key={label} className="border border-amber-400/15 bg-[linear-gradient(145deg,rgba(16,16,14,.82),rgba(2,2,2,.82))] p-4 shadow-[inset_0_1px_rgba(255,255,255,.025)] transition hover:border-amber-400/30"><div className="flex items-center gap-3"><div className="grid size-11 place-items-center rounded-md border border-amber-400/25 bg-amber-400/[.08] text-amber-300"><Icon className="size-5" strokeWidth={1.8} /></div><div><div className="font-mono text-[10px] font-semibold uppercase tracking-[.12em] text-stone-400">{label}</div><div className="mt-1 text-2xl font-bold text-amber-300">{value}</div></div></div></div>)}
          </section>

          <section className="mt-5 overflow-hidden border border-amber-400/10 bg-black/45">
            <div className="hidden grid-cols-[minmax(240px,1.6fr)_130px_100px_100px_160px_150px] gap-3 border-b border-amber-400/15 bg-amber-400/[.035] px-5 py-3.5 font-mono text-[10px] font-bold uppercase tracking-[.12em] text-stone-400 lg:grid">
              <span>Case title</span><span>Case ID</span><span>Priority</span><span>Status</span><span>Updated</span><span>Investigator</span>
            </div>
            <div className="divide-y divide-amber-400/10">
              {cases.map((item) => <article key={item.id} className="group p-3 transition hover:bg-amber-400/[.025] lg:p-0">
                <div className="grid items-center gap-3 lg:grid-cols-[minmax(240px,1.6fr)_130px_100px_100px_160px_150px] lg:px-5 lg:py-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="relative size-[72px] shrink-0 overflow-hidden rounded-md border border-stone-700 bg-stone-950 shadow-lg">
                      {item.image ? <div role="img" aria-label={`${item.title} case`} className="absolute inset-0 bg-cover bg-center opacity-80 transition group-hover:opacity-100" style={{ backgroundImage: `url(${JSON.stringify(item.image).slice(1, -1)})` }} /> : <div className="grid h-full place-items-center"><Network className="size-6 text-amber-400/25" /></div>}
                      <div className="absolute inset-0 ring-1 ring-inset ring-white/[.04]" />
                    </div>
                    <div className="min-w-0"><Link href={`/cases/${item.id}/board`} className="truncate text-base font-semibold text-white hover:text-amber-300">{item.title}</Link><p className="mt-1 line-clamp-1 text-sm text-stone-400">{item.description || "No case description recorded."}</p><p className="mt-1.5 font-mono text-[10px] text-stone-500">{item._count.nodes} nodes · {item._count.notes} notes</p></div>
                  </div>
                  <div className="font-mono text-[13px] text-stone-200"><span className="mr-2 text-[10px] uppercase text-stone-500 lg:hidden">ID</span>{item.caseId}</div>
                  <div><span className={`inline-flex rounded border px-2.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider ${priorityTone(item.priority)}`}>{item.priority}</span></div>
                  <div><span className="inline-flex items-center gap-1.5 rounded border border-amber-400/30 bg-amber-400/[.08] px-2.5 py-1.5 font-mono text-[10px] font-bold uppercase text-amber-200"><span className="size-1.5 rounded-full bg-amber-300 shadow-[0_0_6px_#facc15]" />{item.status}</span></div>
                  <div className="text-[13px] leading-5 text-stone-400">{formatDate(item.updatedAt)}</div>
                  <div className="min-w-0"><div className="truncate text-[13px] text-stone-200">{item.assignedAnalyst}</div><div className="mt-1 text-[10px] uppercase tracking-wider text-stone-500">Investigator</div></div>
                </div>
                <div className="flex flex-wrap gap-2 border-t border-amber-400/10 bg-black/30 px-5 py-3 lg:justify-end">
                  <Link href={`/cases/${item.id}/board`} className="inline-flex h-9 items-center gap-2 rounded border border-amber-400/25 bg-amber-400/[.08] px-3 text-xs font-medium text-amber-100 hover:bg-amber-400/15"><BookOpen className="size-4" /> Open Board</Link>
                  <Link href={`/cases/${item.id}`} className="inline-flex h-9 items-center gap-2 rounded border border-stone-700 px-3 text-xs text-stone-300 hover:border-amber-400/40 hover:text-white"><Pencil className="size-4 text-amber-300" /> Edit</Link>
                  <GenerateReportButton caseId={item.id} />
                  <CaseDeleteButton id={item.id} />
                </div>
              </article>)}
              {!cases.length && <div className="p-14 text-center"><FileText className="mx-auto size-8 text-amber-400/25" /><p className="mt-3 text-sm text-stone-500">No investigation files found.</p></div>}
            </div>
            <div className="border-t border-amber-400/10 px-4 py-3 font-mono text-[9px] uppercase tracking-wider text-stone-600">Showing {cases.length} secured case {cases.length === 1 ? "record" : "records"}</div>
          </section>
        </div>

        <aside id="create-case" className="scroll-mt-24"><div className="sticky top-24 border border-amber-400/30 bg-black/75 p-1 shadow-[0_20px_70px_rgba(0,0,0,.65),0_0_30px_rgba(250,204,21,.04)]"><CaseForm currentUserName={user.name} commandStyle /></div></aside>
      </div>
    </div>
  </div></AppShell>;
=======
  const currentUser = await getCurrentUserFromCookies();
  const cases = await prisma.case.findMany({
    where: readableCaseWhere(currentUser.id),
    orderBy: { updatedAt: "desc" },
    include: { user: { select: publicUserSelect }, shares: { where: { userId: currentUser.id } }, _count: { select: { nodes: true, edges: true, evidence: true, notes: true } } }
  });

  return (
    <AppShell>
      <div className="grid gap-6 p-5 lg:grid-cols-[1fr_420px] lg:p-8">
        <section className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="text-sm uppercase tracking-[0.22em] text-cyan-300">Case registry</div>
              <h1 className="mt-2 text-3xl font-bold text-white">Cases</h1>
            </div>
            <Link href="#create-case" className="inline-flex h-10 items-center gap-2 rounded-md border border-cyan-400/50 bg-cyan-400/15 px-3 text-sm font-medium text-cyan-50 hover:bg-cyan-400/25">
              <Plus className="size-4" />
              Add Case
            </Link>
          </div>
          <div className="grid gap-4">
            {cases.map((item) => (
              <article key={item.id} className="glass-panel rounded-md p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <Link href={`/cases/${item.id}`} className="text-xl font-semibold text-white hover:text-cyan-200">{item.title}</Link>
                    <div className="mt-1 text-sm text-slate-400">{item.caseId} · {item.codename} · Updated {formatDate(item.updatedAt)}</div>
                    <div className="mt-2 text-xs text-slate-500">{item.userId === currentUser.id ? "Owned by you" : `Shared by ${item.user?.name ?? "another user"} · ${item.shares[0]?.access ?? "Viewer"}`}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-md border px-2 py-1 text-xs ${priorityTone(item.priority)}`}>{item.priority}</span>
                    <span className="rounded-md border border-emerald-400/30 bg-emerald-400/10 px-2 py-1 text-xs text-emerald-100">{item.status}</span>
                  </div>
                </div>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">{item.description}</p>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-400">
                  <span>{item._count.nodes} nodes</span>
                  <span>{item._count.edges} relations</span>
                  <span>{item._count.evidence} evidence files</span>
                  <span>{item._count.notes} notes</span>
                </div>
                <div className="mt-4 flex gap-2">
                  <Link href={`/cases/${item.id}/board`} className="rounded-md border border-cyan-400/40 bg-cyan-400/10 px-3 py-2 text-sm font-medium text-cyan-50">Open Board</Link>
                  <Link href={`/cases/${item.id}/timeline`} className="rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-200">Timeline</Link>
                  <CaseDeleteButton id={item.id} />
                </div>
              </article>
            ))}
            {cases.length === 0 && (
              <div className="glass-panel rounded-md p-10 text-center">
                <Plus className="mx-auto size-8 text-cyan-300" />
                <h2 className="mt-4 text-xl font-semibold text-white">No cases yet</h2>
                <p className="mt-2 text-sm text-slate-400">Create a case or run the seed script to load Operation Nightfall.</p>
              </div>
            )}
          </div>
        </section>
        <aside id="create-case" className="scroll-mt-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Create Case</h2>
          <CaseForm currentUserName={currentUser.name} />
          <div className="glass-panel rounded-md p-4 text-sm text-slate-400">
            <Trash2 className="mb-2 size-4 text-red-300" />
            Delete controls are available on each case card and inside each case workspace.
          </div>
        </aside>
      </div>
    </AppShell>
  );
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
}
