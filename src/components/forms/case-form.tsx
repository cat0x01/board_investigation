"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { ImageIcon, Link2, Plus, Save, ShieldCheck, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { PRIORITIES } from "@/types/caselink";

type CaseFormValues = {
  caseId: string;
  title: string;
  description: string;
  image: string;
  urls: string;
  priority: string;
  assignedAnalyst: string;
};

export function CaseForm({ initial, compact = false, commandStyle = false, currentUserName = "Local Analyst" }: { initial?: Partial<CaseFormValues> & { id?: string }; compact?: boolean; commandStyle?: boolean; currentUserName?: string }) {
  const router = useRouter();
  const [generatedCaseId] = useState(() => `INT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 8999)}`);
  const [error, setError] = useState("");
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<CaseFormValues>({
    defaultValues: {
      caseId: initial?.caseId ?? generatedCaseId,
      title: initial?.title ?? "",
      description: initial?.description ?? "",
      image: initial?.image ?? "",
      urls: initial?.urls ?? "",
      priority: initial?.priority ?? "Medium",
      assignedAnalyst: initial?.assignedAnalyst ?? currentUserName,
    }
  });

  async function onSubmit(values: CaseFormValues) {
    setError("");
    const response = await fetch(initial?.id ? `/api/cases/${initial.id}` : "/api/cases", {
      method: initial?.id ? "PATCH" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(initial?.id ? values : { ...values, codename: "Case File", status: "Active", tags: "" })
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setError(typeof body.error === "string" ? body.error : "Unable to save case.");
      return;
    }
    const saved = await response.json();
    router.refresh();
    if (!initial?.id) router.push(`/cases/${saved.id}/board`);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={compact ? "grid gap-5" : commandStyle ? "case-command-form grid min-w-0 gap-5 bg-[linear-gradient(145deg,rgba(15,15,13,.98),rgba(1,1,1,.96))] p-6" : "glass-panel grid min-w-0 gap-6 rounded-2xl p-6"}>
      {!compact && (commandStyle ? <div className="flex items-center gap-3 border-b border-amber-400/10 pb-4"><Image src="/logo.png" alt="CAT0X01" width={48} height={48} className="size-12 rounded-full object-cover" /><div><div className="font-mono text-sm font-bold uppercase tracking-[.14em] text-amber-300">New Case File</div><p className="mt-1 text-xs leading-5 text-stone-500">Only essential operational information is required.</p></div></div> : <div><div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.2em] text-amber-400"><ShieldCheck className="size-4" /> New case file</div><p className="mt-2 text-sm text-slate-500">Only essential operational information is required.</p></div>)}
      <div className="grid min-w-0 gap-4">
        <Field label="Case title"><Input {...register("title", { required: true })} placeholder="Operation Nightfall" /></Field>
        <Field label="Case ID"><Input {...register("caseId", { required: true })} placeholder="INT-2026-1024" /></Field>
      </div>
      <Field label="Description"><Textarea {...register("description")} className="min-h-32 resize-y" placeholder="Objective, context and current findings..." /></Field>
      <div className="grid min-w-0 gap-4">
        <Field label="Case image URL"><div className="relative min-w-0"><ImageIcon className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-slate-500" /><Input {...register("image")} className="pl-10" placeholder="https://..." /></div></Field>
        <Field label="Reference URLs (optional)"><div className="relative min-w-0"><Link2 className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-slate-500" /><Textarea {...register("urls")} rows={1} className="h-11 min-h-0 resize-none overflow-hidden py-3 pl-10" placeholder="One URL per line" /></div></Field>
        <Field label="Priority"><Select {...register("priority")}>{PRIORITIES.map((item) => <option key={item}>{item}</option>)}</Select></Field>
        <Field label="Assigned investigator"><div className="relative min-w-0"><UserRound className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-slate-500" /><Input {...register("assignedAnalyst", { required: true })} className="pl-10" placeholder="Name or team" /></div></Field>
      </div>
      {error && <div className="rounded-lg border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-100">{error}</div>}
      <Button type="submit" variant="primary" disabled={isSubmitting} className={commandStyle ? "h-11 w-full border-amber-400/40 bg-amber-400/10 font-mono text-xs font-bold uppercase tracking-wider text-amber-200" : "h-11 w-full sm:w-fit"}>
        {initial?.id ? <Save className="size-4" /> : <Plus className="size-4" />}{isSubmitting ? "Saving..." : initial?.id ? "Save Changes" : "Create Case & Open Board"}
      </Button>
    </form>
  );
}
