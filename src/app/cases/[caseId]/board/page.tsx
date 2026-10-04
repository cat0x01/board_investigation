import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { BoardClient } from "@/components/board/board-client";
import { getCurrentUserFromCookies, readableCaseWhere } from "@/lib/current-user";
import { prisma } from "@/lib/db/prisma";
import { parseNode } from "@/lib/db/serde";
import type { CaseEdgeRecord, CaseNodeRecord } from "@/types/caselink";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ caseId: string }> };

export default async function BoardPage({ params }: Props) {
  const { caseId } = await params;
  const currentUser = await getCurrentUserFromCookies();
  const record = await prisma.case.findFirst({ where: { id: caseId, ...readableCaseWhere(currentUser.id) }, include: { nodes: true, edges: true, shares: { where: { userId: currentUser.id } } } });
  if (!record) notFound();
  const nodes = JSON.parse(JSON.stringify(record.nodes.map(parseNode))) as CaseNodeRecord[];
  const edges = JSON.parse(JSON.stringify(record.edges)) as CaseEdgeRecord[];
  const canEdit = record.userId === currentUser.id || record.shares[0]?.access === "Editor";

  return (
    <AppShell>
      <div className="border-b border-slate-800 bg-slate-950/50 px-5 py-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="border border-amber-400/30 bg-amber-400/10 px-2 py-1 font-mono text-[10px] font-bold tracking-[0.22em] text-amber-300">CLASSIFIED</span>
          <h1 className="text-xl font-bold text-white">{record.title}</h1>
          <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-xs text-amber-100">{record.status}</span>
          <span className="rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5 text-xs text-slate-300">{record.userId === currentUser.id ? "Owner" : `Shared · ${record.shares[0]?.access ?? "Viewer"}`}</span>
          <span className="ml-auto hidden font-mono text-[10px] tracking-[0.18em] text-amber-300/60 md:block">INTELLIGENCE LINK ANALYSIS // {record.caseId}</span>
        </div>
      </div>
      <BoardClient caseId={record.id} initialNodes={nodes} initialEdges={edges} editable={canEdit} />
    </AppShell>
  );
}
