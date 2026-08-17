"use client";

import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";

export function EvidenceForm({ caseId }: { caseId: string }) {
  const router = useRouter();
  async function submit(formData: FormData) {
    const response = await fetch(`/api/cases/${caseId}/evidence`, { method: "POST", body: formData });
    if (!response.ok) throw new Error("Unable to save evidence.");
    router.refresh();
  }

  return (
    <form action={submit} className="glass-panel grid gap-4 rounded-md p-5">
      <h2 className="text-lg font-semibold text-white">Add Evidence</h2>
      <Field label="Title"><Input name="title" required /></Field>
      <Field label="Upload file"><Input name="file" type="file" /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="File type"><Input name="fileType" placeholder="PDF, image, text..." /></Field>
        <Field label="Collection date"><Input name="collectionDate" type="datetime-local" /></Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Source"><Input name="source" /></Field>
        <Field label="Collected by"><Input name="collectedBy" /></Field>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <Field label="MD5"><Input name="md5" /></Field>
        <Field label="SHA1"><Input name="sha1" /></Field>
        <Field label="SHA256"><Input name="sha256" /></Field>
      </div>
      <Field label="Related node IDs"><Input name="relatedNodeIds" placeholder="node-a, node-b" /></Field>
      <Field label="Chain of custody"><Textarea name="chainOfCustodyNotes" /></Field>
      <Button type="submit" variant="primary"><Upload className="size-4" /> Save Evidence</Button>
    </form>
  );
}
