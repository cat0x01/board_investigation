import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Network, NotebookPen } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { CaseForm } from "@/components/forms/case-form";
import { GenerateReportButton } from "@/components/generate-report-button";
import { getCurrentUserFromCookies, readableCaseWhere } from "@/lib/current-user";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ caseId: string }> };

export default async function CaseDetailPage({ params }: Props) {
  const { caseId } = await params;
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
}
