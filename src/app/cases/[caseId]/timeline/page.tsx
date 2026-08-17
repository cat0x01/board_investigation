import { notFound } from "next/navigation";
import { Search } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { CaseTabs } from "@/components/case-tabs";
import { TimelineForm } from "@/components/forms/timeline-form";
import { Input } from "@/components/ui/field";
import { getCurrentUserFromCookies, readableCaseWhere } from "@/lib/current-user";
import { prisma } from "@/lib/db/prisma";
import { formatDate, priorityTone } from "@/lib/format";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ caseId: string }>; searchParams: Promise<{ q?: string }> };

export default async function TimelinePage({ params, searchParams }: Props) {
  const { caseId } = await params;
  const { q = "" } = await searchParams;
  const currentUser = await getCurrentUserFromCookies();
  const record = await prisma.case.findFirst({
    where: { id: caseId, ...readableCaseWhere(currentUser.id) },
    include: { shares: { where: { userId: currentUser.id } }, timelineEvents: { where: q ? { OR: [{ title: { contains: q } }, { description: { contains: q } }, { eventType: { contains: q } }] } : undefined, orderBy: { occurredAt: "desc" } } }
  });
  if (!record) notFound();
  const canEdit = record.userId === currentUser.id || record.shares[0]?.access === "Editor";

  return (
    <AppShell>
      <div className="space-y-6 p-5 lg:p-8">
        <Header title={`${record.title} Timeline`} caseId={record.id} active="timeline" />
        <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
          <section className="space-y-4">
            <form className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
              <Input name="q" defaultValue={q} placeholder="Search events..." className="w-full pl-9" />
            </form>
            <div className="relative space-y-5 border-l border-cyan-400/25 pl-6">
              {record.timelineEvents.map((event) => (
                <article key={event.id} className="glass-panel relative rounded-md p-5">
                  <span className="absolute -left-[31px] top-6 size-3 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,.9)]" />
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="text-xs uppercase tracking-[0.18em] text-cyan-300">{event.eventType}</div>
                      <h2 className="mt-1 text-lg font-semibold text-white">{event.title}</h2>
                    </div>
                    <span className={`rounded-md border px-2 py-1 text-xs ${priorityTone(event.severity)}`}>{event.severity}</span>
                  </div>
                  <div className="mt-2 text-sm text-slate-400">{formatDate(event.occurredAt)}</div>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{event.description}</p>
                </article>
              ))}
              {record.timelineEvents.length === 0 && <div className="glass-panel rounded-md p-8 text-center text-slate-400">No timeline events match the current filters.</div>}
            </div>
          </section>
          {canEdit ? <TimelineForm caseId={record.id} /> : <ReadOnlyPanel />}
        </div>
      </div>
    </AppShell>
  );
}

function ReadOnlyPanel() {
  return <aside className="glass-panel h-fit rounded-md p-5 text-sm text-slate-300">Viewer access is read-only. Ask the owner for Editor access to add timeline events.</aside>;
}

function Header({ title, caseId, active }: { title: string; caseId: string; active: string }) {
  return <div className="flex flex-wrap items-end justify-between gap-4"><div><div className="text-sm uppercase tracking-[0.22em] text-cyan-300">Case workspace</div><h1 className="mt-2 text-3xl font-bold text-white">{title}</h1></div><CaseTabs caseId={caseId} active={active} /></div>;
}
