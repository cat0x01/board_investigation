import Link from "next/link";
import { notFound } from "next/navigation";
import { UserRound } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { CaseTabs } from "@/components/case-tabs";
import { getCurrentUserFromCookies, readableCaseWhere } from "@/lib/current-user";
import { prisma } from "@/lib/db/prisma";
import { initials, priorityTone } from "@/lib/format";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ caseId: string }> };

export default async function PersonsPage({ params }: Props) {
  const { caseId } = await params;
  const currentUser = await getCurrentUserFromCookies();
  const record = await prisma.case.findFirst({ where: { id: caseId, ...readableCaseWhere(currentUser.id) }, include: { nodes: { where: { type: { in: ["Person", "Suspect", "Victim"] } }, orderBy: { updatedAt: "desc" } } } });
  if (!record) notFound();
  return (
    <AppShell>
      <div className="space-y-6 p-5 lg:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4"><div><div className="text-sm uppercase tracking-[0.22em] text-cyan-300">Persons of interest</div><h1 className="mt-2 text-3xl font-bold text-white">{record.title}</h1></div><CaseTabs caseId={record.id} active="persons" /></div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {record.nodes.map((node) => (
            <Link key={node.id} href={`/cases/${record.id}/board`} className="glass-panel rounded-md p-5 transition hover:border-cyan-400/50">
              <div className="flex gap-4">
                <div className="grid size-16 place-items-center rounded-md border border-slate-700 bg-slate-900 text-lg font-bold text-cyan-100">{node.image ? <img src={node.image} alt="" className="h-full w-full rounded-md object-cover" /> : initials(node.title)}</div>
                <div>
                  <h2 className="font-semibold text-white">{node.title}</h2>
                  <div className="mt-1 text-sm text-cyan-200">{node.subtitle || node.type}</div>
                  <span className={`mt-3 inline-block rounded-md border px-2 py-1 text-xs ${priorityTone(node.priority)}`}>{node.priority}</span>
                </div>
              </div>
              <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-300">{node.description}</p>
            </Link>
          ))}
          {record.nodes.length === 0 && <div className="glass-panel rounded-md p-10 text-center text-slate-400 md:col-span-2 xl:col-span-3"><UserRound className="mx-auto mb-3 size-8 text-cyan-300" />No person nodes yet. Add people from the board.</div>}
        </div>
      </div>
    </AppShell>
  );
}
