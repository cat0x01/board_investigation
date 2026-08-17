"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Pin, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";

export function NoteForm({ caseId }: { caseId: string }) {
  const router = useRouter();
  const [body, setBody] = useState("## Findings\n\n");
<<<<<<< HEAD
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(formData: FormData) {
    setError("");
    setSaving(true);
    try {
      const response = await fetch(`/api/cases/${caseId}/notes`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData))
      });
      if (!response.ok) {
        const result = await response.json().catch(() => null);
        setError(result?.error || "Unable to save note.");
        return;
      }
      setBody("## Findings\n\n");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={(event) => { event.preventDefault(); void submit(new FormData(event.currentTarget)); }} className="glass-panel grid gap-4 rounded-md p-5">
=======

  async function submit(formData: FormData) {
    const response = await fetch(`/api/cases/${caseId}/notes`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData))
    });
    if (!response.ok) throw new Error("Unable to save note.");
    router.refresh();
  }

  return (
    <form action={submit} className="glass-panel grid gap-4 rounded-md p-5">
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
      <h2 className="text-lg font-semibold text-white">Create Note</h2>
      <Field label="Title"><Input name="title" required /></Field>
      <Field label="Tags"><Input name="tags" placeholder="intel, interview, priority" /></Field>
      <Field label="Linked nodes"><Input name="linkedNodeIds" /></Field>
      <label className="flex items-center gap-2 text-sm text-slate-300"><input name="pinned" type="checkbox" value="true" /> <Pin className="size-4" /> Pin note</label>
      <div className="grid gap-4 lg:grid-cols-2">
        <Field label="Markdown"><Textarea name="body" value={body} onChange={(event) => setBody(event.target.value)} className="min-h-72" /></Field>
        <div className="rounded-md border border-slate-800 bg-slate-950/70 p-4">
          <div className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">Preview</div>
          <div className="markdown-preview prose prose-invert max-w-none text-sm text-slate-300">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
          </div>
        </div>
      </div>
<<<<<<< HEAD
      {error && <p role="alert" className="rounded-md border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200">{error}</p>}
      <Button type="submit" variant="primary" disabled={saving}><Save className="size-4" /> {saving ? "Saving..." : "Save Note"}</Button>
=======
      <Button type="submit" variant="primary"><Save className="size-4" /> Save Note</Button>
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
    </form>
  );
}
