import Link from "next/link";
import { notFound } from "next/navigation";
<<<<<<< HEAD
import { ArrowLeft, Network, NotebookPen } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { CaseForm } from "@/components/forms/case-form";
import { GenerateReportButton } from "@/components/generate-report-button";
import { getCurrentUserFromCookies, readableCaseWhere } from "@/lib/current-user";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";
=======
import { Download, FileJson, Network } from "lucide-react";
import { CaseDeleteButton } from "@/components/case-delete-button";
import { AppShell } from "@/components/layout/app-shell";
import { CaseForm } from "@/components/forms/case-form";
import { ShareCasePanel } from "@/components/share-case-panel";
import { Button } from "@/components/ui/button";
import { getCurrentUserFromCookies, publicUserSelect, readableCaseWhere } from "@/lib/current-user";
import { prisma } from "@/lib/db/prisma";
import { parseCase } from "@/lib/db/serde";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
type Props = { params: Promise<{ caseId: string }> };

export default async function CaseDetailPage({ params }: Props) {
  const { caseId } = await params;
<<<<<<< HEAD
  const user = await getCurrentUserFromCookies();
  const item = await prisma.case.findFirst({ where: { id: caseId, ...readableCaseWhere(user.id) }, include: { shares: { where: { userId: user.id } } } });
  if (!item) notFound();
  const canEdit = item.userId === user.id || item.shares[0]?.access === "Editor";
  return <AppShell><div className="mx-auto max-w-5xl space-y-6 p-5 lg:p-8">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div><Link href="/cases" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-amber-300"><ArrowLeft className="size-4" /> All cases</Link><h1 className="mt-3 text-3xl font-bold text-white">{item.title}</h1><p className="mt-1 text-sm text-amber-400">{item.caseId}</p></div>
      <div className="flex gap-2"><Link href={`/cases/${item.id}/board`} className="inline-flex h-10 items-center gap-2 rounded-lg bg-amber-500/15 px-3 text-sm text-amber-100"><Network className="size-4" /> Board</Link><Link href={`/cases/${item.id}/notes`} className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-700 px-3 text-sm text-slate-200"><NotebookPen className="size-4" /> Notes</Link><GenerateReportButton caseId={item.id} /></div>
    </div>
    {canEdit ? <CaseForm initial={item} currentUserName={user.name} /> : <div className="glass-panel rounded-xl p-6"><div className="text-xs uppercase tracking-widest text-amber-300">Read-only case</div><p className="mt-4 leading-7 text-slate-300">{item.description || "No description recorded."}</p></div>}
  </div></AppShell>;
=======
  const currentUser = await getCurrentUserFromCookies();
  const item = await prisma.case.findFirst({
    where: { id: caseId, ...readableCaseWhere(currentUser.id) },
    include: { user: { select: publicUserSelect }, shares: { include: { user: { select: publicUserSelect } }, orderBy: { createdAt: "desc" } }, _count: { select: { nodes: true, edges: true, evidence: true, timelineEvents: true, notes: true } } }
  });
  if (!item) notFound();
  const parsed = parseCase(item);
  const users = await prisma.user.findMany({ where: { passwordHash: { not: "" } }, select: publicUserSelect, orderBy: { name: "asc" } });
  const isOwner = item.userId === currentUser.id;
  const canEdit = isOwner || item.shares.some((share) => share.userId === currentUser.id && share.access === "Editor");

  return (
    <AppShell>
      <div className="space-y-6 p-5 lg:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-sm uppercase tracking-[0.22em] text-cyan-300">Case file</div>
            <h1 className="mt-2 text-3xl font-bold text-white">{item.title}</h1>
            <div className="mt-2 text-sm text-slate-400">{item.caseId} · {item.codename} · Updated {formatDate(item.updatedAt)}</div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={`/cases/${item.id}/board`} className="inline-flex h-10 items-center gap-2 rounded-md border border-cyan-400/50 bg-cyan-400/15 px-3 text-sm font-medium text-cyan-50"><Network className="size-4" /> Open Board</Link>
            <form action={`/api/export/case/${item.id}`} method="post">
              <Button type="submit"><FileJson className="size-4" /> Export JSON</Button>
            </form>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-5">
          <Stat label="Nodes" value={item._count.nodes} />
          <Stat label="Relations" value={item._count.edges} />
          <Stat label="Evidence" value={item._count.evidence} />
          <Stat label="Timeline" value={item._count.timelineEvents} />
          <Stat label="Notes" value={item._count.notes} />
        </div>
        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          {canEdit ? (
            <CaseForm initial={{ ...parsed, tags: parsed.tags }} currentUserName={currentUser.name} />
          ) : (
            <section className="glass-panel rounded-md p-5">
              <h2 className="text-lg font-semibold text-white">Read-only Case</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">{item.description || "No description recorded."}</p>
              <div className="mt-4 text-sm text-slate-400">Owner: {item.user?.name ?? "Unknown"} · Your access: Viewer</div>
            </section>
          )}
          <aside className="space-y-4">
            <div className="glass-panel rounded-md p-5">
              <h2 className="text-lg font-semibold text-white">Workspace</h2>
              <div className="mt-4 grid gap-2">
                {["board", "timeline", "evidence", "persons", "notes"].map((section) => (
                  <Link key={section} href={`/cases/${item.id}/${section}`} className="rounded-md border border-slate-800 bg-slate-950/50 px-3 py-2 text-sm capitalize text-slate-200 hover:border-cyan-400/50">{section}</Link>
                ))}
              </div>
              <div className="mt-6 rounded-md border border-slate-800 bg-slate-950/50 p-3 text-sm text-slate-400">
                <Download className="mb-2 size-4 text-cyan-300" />
                PDF and board PNG exports are available from the board toolbar.
              </div>
              {isOwner && <CaseDeleteButton id={item.id} />}
            </div>
            {isOwner && <ShareCasePanel caseId={item.id} users={users} shares={item.shares} ownerId={item.userId} />}
          </aside>
        </div>
      </div>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="glass-panel rounded-md p-4">
      <div className="text-sm text-slate-400">{label}</div>
      <div className="mt-2 text-2xl font-bold text-white">{value}</div>
    </div>
  );
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
}
