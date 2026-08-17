import Link from "next/link";
import { notFound } from "next/navigation";
import { Download, FileArchive, Search, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { CaseTabs } from "@/components/case-tabs";
import { EvidenceDeleteButton } from "@/components/evidence-delete-button";
import { EvidenceForm } from "@/components/forms/evidence-form";
import { Input } from "@/components/ui/field";
import { getCurrentUserFromCookies, readableCaseWhere } from "@/lib/current-user";
import { prisma } from "@/lib/db/prisma";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ caseId: string }>; searchParams: Promise<{ q?: string }> };

export default async function EvidencePage({ params, searchParams }: Props) {
  const { caseId } = await params;
  const { q = "" } = await searchParams;
  const currentUser = await getCurrentUserFromCookies();
  const record = await prisma.case.findFirst({
    where: { id: caseId, ...readableCaseWhere(currentUser.id) },
    include: { shares: { where: { userId: currentUser.id } }, evidence: { where: q ? { OR: [{ title: { contains: q } }, { fileName: { contains: q } }, { source: { contains: q } }] } : undefined, orderBy: { updatedAt: "desc" } } }
  });
  if (!record) notFound();
  const canEdit = record.userId === currentUser.id || record.shares[0]?.access === "Editor";

  return (
    <AppShell>
      <div className="space-y-6 p-5 lg:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4"><div><div className="text-sm uppercase tracking-[0.22em] text-cyan-300">Evidence vault</div><h1 className="mt-2 text-3xl font-bold text-white">{record.title}</h1></div><CaseTabs caseId={record.id} active="evidence" /></div>
        <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
          <section className="space-y-4">
            <form className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
              <Input name="q" defaultValue={q} placeholder="Search evidence..." className="w-full pl-9" />
            </form>
            <div className="grid gap-4 md:grid-cols-2">
              {record.evidence.map((item) => (
                <article key={item.id} className="glass-panel rounded-md p-5">
                  <div className="flex items-start gap-3">
                    <div className="grid size-12 place-items-center rounded-md border border-cyan-400/30 bg-cyan-400/10"><FileArchive className="size-6 text-cyan-200" /></div>
                    <div className="min-w-0 flex-1">
                      <h2 className="truncate font-semibold text-white">{item.title}</h2>
                      <div className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">{item.fileType}</div>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-2 text-sm text-slate-300">
                    <div>Source: {item.source || "Unspecified"}</div>
                    <div>Collected by: {item.collectedBy || "Unspecified"}</div>
                    <div>Collection date: {formatDate(item.collectionDate)}</div>
                    <div>SHA256: <span className="font-mono text-xs text-slate-400">{item.sha256 || "Not recorded"}</span></div>
                  </div>
                  <p className="mt-3 line-clamp-3 text-sm text-slate-400">{item.chainOfCustodyNotes}</p>
                  <div className="mt-4 flex gap-2">
                    {item.filePath && <Link href={`/api/evidence/${item.id}`} className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-700 px-3 text-sm text-slate-200"><Download className="size-4" /> Download</Link>}
                    {canEdit && <EvidenceDeleteButton id={item.id} />}
                  </div>
                </article>
              ))}
              {record.evidence.length === 0 && <div className="glass-panel rounded-md p-8 text-center text-slate-400 md:col-span-2"><ShieldCheck className="mx-auto mb-3 size-7 text-cyan-300" />No evidence has been added for this filter.</div>}
            </div>
          </section>
          {canEdit ? <EvidenceForm caseId={record.id} /> : <ReadOnlyPanel />}
        </div>
      </div>
    </AppShell>
  );
}

function ReadOnlyPanel() {
  return <aside className="glass-panel h-fit rounded-md p-5 text-sm text-slate-300">Viewer access is read-only. Ask the owner for Editor access to add or delete evidence.</aside>;
}
