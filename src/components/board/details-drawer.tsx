"use client";

import { useMemo, useState } from "react";
<<<<<<< HEAD
import Link from "next/link";
import { Eye, Pencil, Save, Trash2, X } from "lucide-react";
=======
import { Save, Trash2, X } from "lucide-react";
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { useBoardStore } from "@/stores/board-store";
import { DIRECTIONS, LINE_STYLES, NODE_TYPES, PRIORITIES, RELATION_TYPES } from "@/types/caselink";
<<<<<<< HEAD
import { uploadSelectedFiles } from "@/lib/client-upload";

export function DetailsDrawer({ caseId, editable = true }: { caseId: string; editable?: boolean }) {
  const selected = useBoardStore((state) => state.selected);
  if (!selected) return null;
  return <DetailsDrawerPanel key={`${selected.kind}-${selected.id}`} caseId={caseId} editable={editable} />;
}

function DetailsDrawerPanel({ caseId, editable }: { caseId: string; editable: boolean }) {
=======

export function DetailsDrawer({ editable = true }: { editable?: boolean }) {
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
  const { nodes, edges, selected, select, upsertNode, upsertEdge, removeNode, removeEdge } = useBoardStore();
  const record = useMemo(() => {
    if (selected?.kind === "node") return nodes.find((item) => item.id === selected.id);
    if (selected?.kind === "edge") return edges.find((item) => item.id === selected.id);
    return null;
  }, [edges, nodes, selected]);
  const [metadataText, setMetadataText] = useState("");
<<<<<<< HEAD
  const [mode, setMode] = useState<"choose" | "edit">("choose");
  const [saveError, setSaveError] = useState("");

  if (!selected || !record) return null;

  if (selected.kind === "node" && "title" in record && mode === "choose") {
    return (
      <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 p-4 backdrop-blur-sm" onMouseDown={() => select(null)}>
        <div className="glass-panel w-full max-w-lg rounded-2xl border border-slate-700 p-6 shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-amber-300">Node dossier</div>
              <h2 className="mt-2 text-2xl font-bold text-white">{record.title}</h2>
              <p className="mt-1 text-sm text-slate-400">Choose how you want to open this record.</p>
            </div>
            <button className="grid size-9 place-items-center rounded-md border border-slate-700 text-slate-300" onClick={() => select(null)} aria-label="Close"><X className="size-4" /></button>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Link href={`/cases/${caseId}/nodes/${record.id}`} className="group rounded-xl border border-amber-400/30 bg-amber-400/10 p-5 transition hover:border-amber-300 hover:bg-amber-400/15">
              <Eye className="size-6 text-amber-300" />
              <div className="mt-4 font-semibold text-white">View dossier</div>
              <div className="mt-1 text-sm leading-6 text-slate-400">Open a clean, structured intelligence profile.</div>
            </Link>
            {editable ? (
              <button type="button" onClick={() => setMode("edit")} className="rounded-xl border border-slate-700 bg-slate-900/70 p-5 text-left transition hover:border-amber-300/60 hover:bg-slate-900">
                <Pencil className="size-6 text-amber-300" />
                <div className="mt-4 font-semibold text-white">Edit record</div>
                <div className="mt-1 text-sm leading-6 text-slate-400">Update identity, media, sources and intelligence.</div>
              </button>
            ) : (
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 opacity-60">
                <Pencil className="size-6 text-slate-500" />
                <div className="mt-4 font-semibold text-slate-300">Editing unavailable</div>
                <div className="mt-1 text-sm leading-6 text-slate-500">Your access to this case is read-only.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  async function updateNode(formData: FormData) {
    if (!record || selected?.kind !== "node") return;
    if (!("metadata" in record)) return;
    let customMetadata = {};
    try {
      customMetadata = metadataText ? JSON.parse(metadataText) : {};
    } catch {
      setSaveError("Metadata JSON is invalid. Correct it before saving.");
      return;
    }
    let uploadedImages: Awaited<ReturnType<typeof uploadSelectedFiles>> = [];
    let uploadedFiles: Awaited<ReturnType<typeof uploadSelectedFiles>> = [];
    try {
      uploadedImages = await uploadSelectedFiles(formData.getAll("imageFiles").filter((entry): entry is File => entry instanceof File && entry.size > 0));
      uploadedFiles = await uploadSelectedFiles(formData.getAll("documentFiles").filter((entry): entry is File => entry instanceof File && entry.size > 0));
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Upload failed.");
      return;
    }
    const existingGallery = String(record.metadata?.galleryImages || "");
    const existingFiles = String(record.metadata?.files || "");
=======

  if (!selected || !record) return null;

  async function updateNode(formData: FormData) {
    if (!record || selected?.kind !== "node") return;
    if (!("metadata" in record)) return;
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
    const payload = {
      title: String(formData.get("title") || ""),
      type: String(formData.get("type") || "Custom Node"),
      subtitle: String(formData.get("subtitle") || ""),
      description: String(formData.get("description") || ""),
<<<<<<< HEAD
      image: String(formData.get("image") || uploadedImages[0]?.url || ""),
=======
      image: String(formData.get("image") || ""),
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
      status: String(formData.get("status") || "Active"),
      priority: String(formData.get("priority") || "Medium"),
      confidence: Number(formData.get("confidence") || 80),
      source: String(formData.get("source") || ""),
      tags: String(formData.get("tags") || ""),
<<<<<<< HEAD
      metadata: {
        ...record.metadata,
        ...customMetadata,
        socialAccounts: String(formData.get("socialAccounts") || ""),
        galleryImages: [existingGallery, ...uploadedImages.map((file) => file.url)].filter(Boolean).join("\n"),
        files: [String(formData.get("files") || existingFiles), ...uploadedFiles.map((file) => `${file.name}::${file.url}`)].filter(Boolean).join("\n"),
        intelligenceNotes: String(formData.get("intelligenceNotes") || "")
      }
    };
    const response = await fetch(`/api/nodes/${record.id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
    const result = await response.json().catch(() => null);
    if (!response.ok || !result?.id) {
      setSaveError(result?.error || "The record could not be saved.");
      return;
    }
    setSaveError("");
    upsertNode(result);
=======
      metadata: metadataText ? JSON.parse(metadataText) : record.metadata
    };
    const response = await fetch(`/api/nodes/${record.id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
    upsertNode(await response.json());
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
  }

  async function updateEdge(formData: FormData) {
    if (!record || selected?.kind !== "edge") return;
    const payload = {
      relationType: String(formData.get("relationType") || "Related To"),
      shortDescription: String(formData.get("shortDescription") || ""),
      confidence: Number(formData.get("confidence") || 75),
      source: String(formData.get("source") || ""),
<<<<<<< HEAD
      color: String(formData.get("color") || "#facc15"),
=======
      color: String(formData.get("color") || "#38bdf8"),
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
      lineStyle: String(formData.get("lineStyle") || "solid"),
      direction: String(formData.get("direction") || "one-way"),
      occurredAt: String(formData.get("occurredAt") || "") || null
    };
    const response = await fetch(`/api/edges/${record.id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
<<<<<<< HEAD
    const result = await response.json().catch(() => null);
    if (!response.ok || !result?.id) {
      setSaveError(result?.error || "The relationship could not be saved.");
      return;
    }
    setSaveError("");
    upsertEdge(result);
=======
    upsertEdge(await response.json());
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
  }

  async function deleteSelected() {
    if (!record || !selected) return;
<<<<<<< HEAD
    const label = selected.kind === "node" && "title" in record ? `node “${record.title}”` : "this relationship";
    if (!window.confirm(`Permanently delete ${label}? This action cannot be undone.`)) return;
    if (selected.kind === "node") {
      const response = await fetch(`/api/nodes/${record.id}`, { method: "DELETE" });
      if (!response.ok) {
        const result = await response.json().catch(() => null);
        setSaveError(result?.error || "The node could not be deleted.");
        return;
      }
      removeNode(record.id);
    } else {
      const response = await fetch(`/api/edges/${record.id}`, { method: "DELETE" });
      if (!response.ok) {
        const result = await response.json().catch(() => null);
        setSaveError(result?.error || "The relationship could not be deleted.");
        return;
      }
=======
    if (selected.kind === "node") {
      await fetch(`/api/nodes/${record.id}`, { method: "DELETE" });
      removeNode(record.id);
    } else {
      await fetch(`/api/edges/${record.id}`, { method: "DELETE" });
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
      removeEdge(record.id);
    }
  }

  return (
    <aside className="fixed bottom-0 right-0 top-20 z-40 w-full max-w-md overflow-auto border-l border-slate-800 bg-slate-950/95 p-5 shadow-2xl backdrop-blur-xl">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
<<<<<<< HEAD
          <div className="text-xs uppercase tracking-[0.22em] text-amber-300">{selected.kind} dossier</div>
=======
          <div className="text-xs uppercase tracking-[0.22em] text-cyan-300">{selected.kind} dossier</div>
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
          <h2 className="mt-2 text-xl font-bold text-white">{"title" in record ? record.title : record.relationType}</h2>
        </div>
        <button className="grid size-9 place-items-center rounded-md border border-slate-800 text-slate-300" onClick={() => select(null)} aria-label="Close drawer"><X className="size-4" /></button>
      </div>
      {!editable && <div className="mb-4 rounded-md border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-100">Viewer access is read-only. Ask the owner for Editor access to update this board.</div>}
      {selected.kind === "node" && "title" in record ? (
<<<<<<< HEAD
        <form onSubmit={(event) => { event.preventDefault(); void updateNode(new FormData(event.currentTarget)); }} className="grid gap-4">
=======
        <form action={updateNode} className="grid gap-4">
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
          <Field label="Title"><Input name="title" defaultValue={record.title} disabled={!editable} /></Field>
          <Field label="Type"><Select name="type" defaultValue={record.type} disabled={!editable}>{NODE_TYPES.map((item) => <option key={item}>{item}</option>)}</Select></Field>
          <Field label="Subtitle"><Input name="subtitle" defaultValue={record.subtitle} disabled={!editable} /></Field>
          <Field label="Image URL"><Input name="image" defaultValue={record.image} placeholder="/uploads/photo.png or https://..." disabled={!editable} /></Field>
<<<<<<< HEAD
          <Field label="Upload more images"><Input name="imageFiles" type="file" accept="image/*" multiple disabled={!editable} /></Field>
=======
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
          <Field label="Description"><Textarea name="description" defaultValue={record.description} disabled={!editable} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Status"><Input name="status" defaultValue={record.status} disabled={!editable} /></Field>
            <Field label="Priority"><Select name="priority" defaultValue={record.priority} disabled={!editable}>{PRIORITIES.map((item) => <option key={item}>{item}</option>)}</Select></Field>
          </div>
          <Field label="Confidence"><Input name="confidence" type="number" min={0} max={100} defaultValue={record.confidence} disabled={!editable} /></Field>
          <Field label="Source"><Input name="source" defaultValue={record.source} disabled={!editable} /></Field>
          <Field label="Tags"><Input name="tags" defaultValue={(record.tags || []).join(", ")} disabled={!editable} /></Field>
<<<<<<< HEAD
          <Field label="Social accounts"><Textarea name="socialAccounts" defaultValue={String(record.metadata?.socialAccounts || "")} placeholder="One profile URL or @handle per line" disabled={!editable} /></Field>
          <Field label="Files & documents"><Textarea name="files" defaultValue={String(record.metadata?.files || "")} placeholder="One file name or URL per line" disabled={!editable} /></Field>
          <Field label="Upload more files"><Input name="documentFiles" type="file" multiple disabled={!editable} /></Field>
          <Field label="Intelligence notes"><Textarea name="intelligenceNotes" defaultValue={String(record.metadata?.intelligenceNotes || "")} disabled={!editable} /></Field>
          <Field label="Metadata JSON"><Textarea value={metadataText || JSON.stringify(record.metadata ?? {}, null, 2)} onChange={(event) => setMetadataText(event.target.value)} disabled={!editable} /></Field>
          {saveError && <p role="alert" className="rounded-md border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200">{saveError}</p>}
=======
          <Field label="Metadata JSON"><Textarea value={metadataText || JSON.stringify(record.metadata ?? {}, null, 2)} onChange={(event) => setMetadataText(event.target.value)} disabled={!editable} /></Field>
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
          <div className="rounded-md border border-slate-800 bg-slate-950 p-3 text-sm text-slate-400">Linked evidence and activity history are resolved by the evidence vault and audit log for this case.</div>
          {editable && <div className="flex gap-2">
            <Button type="submit" variant="primary"><Save className="size-4" /> Save</Button>
            <Button type="button" variant="danger" onClick={deleteSelected}><Trash2 className="size-4" /> Delete</Button>
          </div>}
        </form>
      ) : (
<<<<<<< HEAD
        <form onSubmit={(event) => { event.preventDefault(); void updateEdge(new FormData(event.currentTarget)); }} className="grid gap-4">
=======
        <form action={updateEdge} className="grid gap-4">
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
          {"relationType" in record && <>
            <Field label="Relation"><Select name="relationType" defaultValue={record.relationType} disabled={!editable}>{RELATION_TYPES.map((item) => <option key={item}>{item}</option>)}</Select></Field>
            <Field label="Short description"><Textarea name="shortDescription" defaultValue={record.shortDescription} disabled={!editable} /></Field>
            <Field label="Confidence"><Input name="confidence" type="number" min={0} max={100} defaultValue={record.confidence} disabled={!editable} /></Field>
            <Field label="Source"><Input name="source" defaultValue={record.source} disabled={!editable} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Color"><Input name="color" type="color" defaultValue={record.color} disabled={!editable} /></Field>
              <Field label="Date/time"><Input name="occurredAt" type="datetime-local" defaultValue={record.occurredAt ? record.occurredAt.slice(0, 16) : ""} disabled={!editable} /></Field>
            </div>
<<<<<<< HEAD
            {saveError && <p role="alert" className="rounded-md border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200">{saveError}</p>}
=======
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
            <div className="grid grid-cols-2 gap-3">
              <Field label="Line style"><Select name="lineStyle" defaultValue={record.lineStyle} disabled={!editable}>{LINE_STYLES.map((item) => <option key={item}>{item}</option>)}</Select></Field>
              <Field label="Direction"><Select name="direction" defaultValue={record.direction} disabled={!editable}>{DIRECTIONS.map((item) => <option key={item}>{item}</option>)}</Select></Field>
            </div>
            {editable && <div className="flex gap-2">
              <Button type="submit" variant="primary"><Save className="size-4" /> Save</Button>
              <Button type="button" variant="danger" onClick={deleteSelected}><Trash2 className="size-4" /> Delete</Button>
            </div>}
          </>}
        </form>
      )}
    </aside>
  );
}
