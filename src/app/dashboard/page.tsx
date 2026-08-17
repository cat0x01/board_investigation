<<<<<<< HEAD
import { redirect } from "next/navigation";

export default function DashboardPage() {
  redirect("/cases");
=======
import Link from "next/link";
import { Activity, AlertTriangle, Briefcase, Database, FileArchive, Network, type LucideIcon } from "lucide-react";
import { CasesByStatusChart, NodesByTypeChart } from "@/components/dashboard/charts";
import { AppShell } from "@/components/layout/app-shell";
import { getCurrentUserFromCookies, readableCaseWhere } from "@/lib/current-user";
import { prisma } from "@/lib/db/prisma";
import { formatDate, priorityTone } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const currentUser = await getCurrentUserFromCookies();
  const caseAccess = readableCaseWhere(currentUser.id);
  const [cases, totalCases, activeCases, highPriority, nodeGroups, statusGroups, evidenceCount, activity] = await Promise.all([
    prisma.case.findMany({ where: caseAccess, orderBy: { updatedAt: "desc" }, take: 8, include: { _count: { select: { nodes: true, evidence: true } } } }),
    prisma.case.count({ where: caseAccess }),
    prisma.case.count({ where: { AND: [caseAccess, { status: "Active" }] } }),
    prisma.case.count({ where: { AND: [caseAccess, { priority: { in: ["High", "Critical"] } }] } }),
    prisma.caseNode.groupBy({ by: ["type"], where: { case: caseAccess }, _count: { type: true } }),
    prisma.case.groupBy({ by: ["status"], where: caseAccess, _count: { status: true } }),
    prisma.evidence.count({ where: { case: caseAccess } }),
    prisma.activityLog.findMany({ where: { OR: [{ caseId: null }, { case: caseAccess }] }, orderBy: { createdAt: "desc" }, take: 8 })
  ]);

  const totalNodes = nodeGroups.reduce((sum, item) => sum + item._count.type, 0);

  return (
    <AppShell>
      <div className="space-y-6 p-5 lg:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-sm uppercase tracking-[0.22em] text-cyan-300">Command dashboard</div>
            <h1 className="mt-2 text-3xl font-bold text-white">CAT0X01 INVESTIGATIOONS</h1>
          </div>
          <Link href="/cases" className="rounded-md border border-cyan-400/50 bg-cyan-400/15 px-4 py-2 text-sm font-medium text-cyan-50">Open Cases</Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <Metric icon={Briefcase} label="Total Cases" value={totalCases} />
          <Metric icon={Activity} label="Active Cases" value={activeCases} />
          <Metric icon={AlertTriangle} label="High Priority" value={highPriority} />
          <Metric icon={Network} label="Total Nodes" value={totalNodes} />
          <Metric icon={FileArchive} label="Evidence Files" value={evidenceCount} />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <section className="glass-panel rounded-md p-5">
            <h2 className="mb-4 text-lg font-semibold text-white">Nodes by Type</h2>
            <div className="h-72">
              <NodesByTypeChart data={nodeGroups.map((item) => ({ name: item.type, value: item._count.type }))} />
            </div>
          </section>
          <section className="glass-panel rounded-md p-5">
            <h2 className="mb-4 text-lg font-semibold text-white">Cases by Status</h2>
            <div className="h-72">
              <CasesByStatusChart data={statusGroups.map((item) => ({ name: item.status, value: item._count.status }))} />
            </div>
          </section>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <section className="glass-panel overflow-hidden rounded-md">
            <div className="border-b border-slate-800 px-5 py-4 text-lg font-semibold text-white">Recent Cases</div>
            <div className="divide-y divide-slate-800/80">
              {cases.map((item) => (
                <Link key={item.id} href={`/cases/${item.id}`} className="grid gap-3 px-5 py-4 transition hover:bg-slate-900/70 md:grid-cols-[1fr_auto_auto]">
                  <div>
                    <div className="font-semibold text-white">{item.title}</div>
                    <div className="text-sm text-slate-400">{item.caseId} · {item.codename}</div>
                  </div>
                  <span className={`h-fit rounded-md border px-2 py-1 text-xs ${priorityTone(item.priority)}`}>{item.priority}</span>
                  <div className="text-sm text-slate-400">{item._count.nodes} nodes · {item._count.evidence} files</div>
                </Link>
              ))}
            </div>
          </section>
          <section className="glass-panel rounded-md p-5">
            <h2 className="mb-4 text-lg font-semibold text-white">Recent Activity</h2>
            <div className="space-y-3">
              {activity.map((item) => (
                <div key={item.id} className="rounded-md border border-slate-800 bg-slate-950/50 p-3">
                  <div className="flex items-center gap-2 text-sm text-slate-200"><Database className="size-4 text-cyan-300" /> {item.action} {item.entity}</div>
                  <div className="mt-1 text-xs text-slate-500">{formatDate(item.createdAt)}</div>
                </div>
              ))}
              {activity.length === 0 && <p className="text-sm text-slate-400">No activity yet. Seed the demo case to populate the feed.</p>}
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}

function Metric({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: number }) {
  return (
    <div className="glass-panel rounded-md p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-400">{label}</div>
        <Icon className="size-5 text-cyan-300" />
      </div>
      <div className="mt-4 text-3xl font-bold text-white">{value}</div>
    </div>
  );
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
}
