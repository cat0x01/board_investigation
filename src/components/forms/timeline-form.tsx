"use client";

import { useRouter } from "next/navigation";
import { CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";

export function TimelineForm({ caseId }: { caseId: string }) {
  const router = useRouter();
  async function submit(formData: FormData) {
    const response = await fetch(`/api/cases/${caseId}/timeline`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData))
    });
    if (!response.ok) throw new Error("Unable to create event.");
    router.refresh();
  }

  return (
    <form action={submit} className="glass-panel grid gap-4 rounded-md p-5">
      <h2 className="text-lg font-semibold text-white">Add Event</h2>
      <Field label="Title"><Input name="title" required /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Date/time"><Input name="occurredAt" type="datetime-local" required /></Field>
        <Field label="Type"><Input name="eventType" placeholder="Surveillance, breach, transfer..." required /></Field>
      </div>
      <Field label="Severity"><Select name="severity"><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></Select></Field>
      <Field label="Related nodes"><Input name="relatedNodeIds" /></Field>
      <Field label="Related evidence"><Input name="relatedEvidenceIds" /></Field>
      <Field label="Description"><Textarea name="description" /></Field>
      <Button type="submit" variant="primary"><CalendarPlus className="size-4" /> Add Event</Button>
    </form>
  );
}
