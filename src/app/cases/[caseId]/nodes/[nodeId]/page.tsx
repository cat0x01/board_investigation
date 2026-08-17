import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, AtSign, Brain, CalendarDays, ExternalLink, FileText, Fingerprint, MapPin, Network, ShieldCheck, Tag } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { ImageCarousel } from "@/components/board/image-carousel";
import { getCurrentUserFromCookies, readableCaseWhere } from "@/lib/current-user";
import { parseNode } from "@/lib/db/serde";
import { prisma } from "@/lib/db/prisma";
import type { CaseNodeRecord } from "@/types/caselink";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ caseId: string; nodeId: string }> };

function valueLabel(value: unknown) {
  if (value === null || value === undefined || value === "") return "—";
  return String(value);
}

function listEntries(value: unknown) {
  return typeof value === "string" ? value.split(/\n|,/).map((item) => item.trim()).filter(Boolean) : [];
}

export default async function NodeDossierPage({ params }: Props) {
  const { caseId, nodeId } = await params;
  const user = await getCurrentUserFromCookies();
  const record = await prisma.caseNode.findFirst({
    where: { id: nodeId, caseId, case: readableCaseWhere(user.id) },
    include: { case: { select: { title: true, caseId: true } }, sourceEdges: true, targetEdges: true }
  });
  if (!record) notFound();
  const node = JSON.parse(JSON.stringify(parseNode(record))) as CaseNodeRecord;
  const sectionKeys = new Set(["socialAccounts", "files", "intelligenceNotes", "galleryImages"]);
  const metadata = Object.entries(node.metadata ?? {}).filter(([key, value]) => !sectionKeys.has(key) && value !== "");
  const socialAccounts = listEntries(node.metadata?.socialAccounts);
  const files = listEntries(node.metadata?.files).map((entry) => {
    const [name, url] = entry.split("::");
    return { name, url: url || (entry.startsWith("/") || entry.startsWith("http") ? entry : "") };
  });
  const galleryImages = [node.image, ...listEntries(node.metadata?.galleryImages)].filter(Boolean);
  const intelligenceNotes = valueLabel(node.metadata?.intelligenceNotes);
  const connections = record.sourceEdges.length + record.targetEdges.length;

  return (
    <AppShell>
      <div className="min-h-[calc(100vh-5rem)] bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,.09),transparent_35%)] p-5 lg:p-9">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <Link href={`/cases/${caseId}/board`} className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-amber-300"><ArrowLeft className="size-4" /> Back to intelligence board</Link>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-500"><Fingerprint className="size-4 text-amber-400" /> {record.case.caseId}</div>
          </div>

          <section className="overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-950/80 shadow-2xl backdrop-blur-xl">
            <div className="border-b border-slate-800 bg-slate-900/50 p-6 lg:p-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="h-32 w-32 shrink-0 overflow-hidden rounded-xl border border-slate-700 bg-slate-900">
                  {node.image ? <Image src={node.image} alt={node.title} width={128} height={128} unoptimized loading="eager" className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-4xl font-bold text-amber-300">{node.title.slice(0, 2).toUpperCase()}</div>}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-400">Intelligence dossier · {node.type}</div>
                  <h1 className="mt-3 text-3xl font-bold text-white lg:text-4xl">{node.title}</h1>
                  <p className="mt-2 text-lg text-slate-300">{node.subtitle || "No subtitle recorded"}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs text-amber-200">{node.status}</span>
                    <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs text-amber-200">{node.priority} priority</span>
                    <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs text-amber-200">{node.confidence}% confidence</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-8 p-6 lg:grid-cols-[1.5fr_1fr] lg:p-8">
              <div className="space-y-7">
                <div><h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Summary</h2><p className="mt-3 whitespace-pre-wrap text-base leading-8 text-slate-200">{node.description || "No description recorded."}</p></div>
                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Identity & intelligence</h2>
                  <dl className="mt-3 grid overflow-hidden rounded-xl border border-slate-800 sm:grid-cols-2">
                    {metadata.length ? metadata.map(([key, value]) => <div key={key} className="border-b border-slate-800 p-4 last:border-b-0 sm:border-r"><dt className="text-[11px] uppercase tracking-widest text-slate-500">{key}</dt><dd className="mt-2 break-words text-sm text-slate-200">{valueLabel(value)}</dd></div>) : <div className="p-4 text-sm text-slate-500">No additional metadata.</div>}
                  </dl>
                </div>
                {node.tags.length > 0 && <div><h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500"><Tag className="size-4" /> Tags</h2><div className="mt-3 flex flex-wrap gap-2">{node.tags.map((tag) => <span key={tag} className="rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-300">{tag}</span>)}</div></div>}
                <ImageCarousel images={galleryImages} title={node.title} />
                <div className="grid gap-5 md:grid-cols-2">
                  <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-5"><h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-300"><AtSign className="size-4" /> Social accounts</h2><div className="mt-4 space-y-2">{socialAccounts.length ? socialAccounts.map((account, index) => <div key={`${account}-${index}`} className="break-all rounded-lg border border-slate-800 bg-black/30 px-3 py-2 text-sm text-slate-200">{account}</div>) : <p className="text-sm text-slate-500">No social profiles recorded.</p>}</div></section>
                  <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-5"><h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-300"><FileText className="size-4" /> Files & documents</h2><div className="mt-4 space-y-2">{files.length ? files.map((file, index) => file.url ? <a key={`${file.name}-${index}`} href={file.url} target="_blank" rel="noreferrer" className="block break-all rounded-lg border border-slate-800 bg-black/30 px-3 py-2 text-sm text-amber-200 hover:border-amber-400/50">{file.name}</a> : <div key={`${file.name}-${index}`} className="break-all rounded-lg border border-slate-800 bg-black/30 px-3 py-2 text-sm text-slate-200">{file.name}</div>) : <p className="text-sm text-slate-500">No attached file references.</p>}</div></section>
                </div>
                <section className="rounded-xl border border-amber-400/20 bg-amber-400/[.04] p-5"><h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-300"><Brain className="size-4" /> Intelligence analysis</h2><p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-300">{intelligenceNotes}</p></section>
              </div>

              <aside className="space-y-4">
                <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5"><div className="flex items-center gap-2 text-sm font-semibold text-white"><Network className="size-4 text-amber-400" /> Connections</div><div className="mt-3 text-3xl font-bold text-white">{connections}</div><div className="mt-1 text-xs text-slate-500">linked board relationships</div></div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5"><div className="flex items-center gap-2 text-sm font-semibold text-white"><ShieldCheck className="size-4 text-amber-400" /> Source</div>{node.source ? <a href={node.source} target="_blank" rel="noreferrer" className="mt-3 flex items-start gap-2 break-all text-sm leading-6 text-amber-300 hover:underline">{node.source}<ExternalLink className="mt-1 size-3 shrink-0" /></a> : <p className="mt-3 text-sm text-slate-500">No source recorded.</p>}</div>
                {typeof node.metadata?.location === "string" && node.metadata.location && <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5"><div className="flex items-center gap-2 text-sm font-semibold text-white"><MapPin className="size-4 text-rose-400" /> Location</div><p className="mt-3 text-sm text-slate-300">{node.metadata.location}</p></div>}
                <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5"><div className="flex items-center gap-2 text-sm font-semibold text-white"><CalendarDays className="size-4 text-amber-400" /> Record history</div><dl className="mt-3 space-y-3 text-sm"><div><dt className="text-xs text-slate-500">Created</dt><dd className="mt-1 text-slate-300">{new Date(node.createdAt).toLocaleString()}</dd></div><div><dt className="text-xs text-slate-500">Last updated</dt><dd className="mt-1 text-slate-300">{new Date(node.updatedAt).toLocaleString()}</dd></div></dl></div>
              </aside>
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
