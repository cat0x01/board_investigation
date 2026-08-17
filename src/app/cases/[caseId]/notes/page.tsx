import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Pin, Search } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { CaseTabs } from "@/components/case-tabs";
import { NoteForm } from "@/components/forms/note-form";
import { Input } from "@/components/ui/field";
import { getCurrentUserFromCookies, readableCaseWhere } from "@/lib/current-user";
import { prisma } from "@/lib/db/prisma";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ caseId: string }>; searchParams: Promise<{ q?: string }> };

export default async function NotesPage({ params, searchParams }: Props) {
  const { caseId } = await params;
  const { q = "" } = await searchParams;
  const currentUser = await getCurrentUserFromCookies();
  const record = await prisma.case.findFirst({
    where: { id: caseId, ...readableCaseWhere(currentUser.id) },
    include: { shares: { where: { userId: currentUser.id } }, notes: { where: q ? { OR: [{ title: { contains: q } }, { body: { contains: q } }] } : undefined, orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }] } }
  });
  if (!record) notFound();
  const canEdit = record.userId === currentUser.id || record.shares[0]?.access === "Editor";
  return (
    <AppShell>
      <div className="space-y-6 p-5 lg:p-8">
<<<<<<< HEAD
        <div className="flex flex-wrap items-end justify-between gap-4"><div><div className="text-sm uppercase tracking-[0.22em] text-amber-300">Analyst notes</div><h1 className="mt-2 text-3xl font-bold text-white">{record.title}</h1></div><CaseTabs caseId={record.id} active="notes" /></div>
=======
        <div className="flex flex-wrap items-end justify-between gap-4"><div><div className="text-sm uppercase tracking-[0.22em] text-cyan-300">Analyst notes</div><h1 className="mt-2 text-3xl font-bold text-white">{record.title}</h1></div><CaseTabs caseId={record.id} active="notes" /></div>
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
        <div className="grid gap-6 xl:grid-cols-[1fr_540px]">
          <section className="space-y-4">
            <form className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
              <Input name="q" defaultValue={q} placeholder="Search notes..." className="w-full pl-9" />
            </form>
            {record.notes.map((note) => (
              <article key={note.id} className="glass-panel rounded-md p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold text-white">{note.title}</h2>
                  {note.pinned && <span className="inline-flex items-center gap-1 rounded-md border border-amber-400/30 bg-amber-400/10 px-2 py-1 text-xs text-amber-100"><Pin className="size-3" /> Pinned</span>}
                </div>
                <div className="mt-1 text-xs text-slate-500">Last edited {formatDate(note.updatedAt)}</div>
                <div className="markdown-preview prose prose-invert mt-4 max-w-none text-sm text-slate-300">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{note.body}</ReactMarkdown>
                </div>
              </article>
            ))}
            {record.notes.length === 0 && <div className="glass-panel rounded-md p-8 text-center text-slate-400">No notes match the current search.</div>}
          </section>
          {canEdit ? <NoteForm caseId={record.id} /> : <ReadOnlyPanel />}
        </div>
      </div>
    </AppShell>
  );
}

function ReadOnlyPanel() {
  return <aside className="glass-panel h-fit rounded-md p-5 text-sm text-slate-300">Viewer access is read-only. Ask the owner for Editor access to create notes.</aside>;
}
