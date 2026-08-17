"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
<<<<<<< HEAD
import Image from "next/image";
import { useForm } from "react-hook-form";
import { ImageIcon, Link2, Plus, Save, ShieldCheck, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { PRIORITIES } from "@/types/caselink";
=======
import { useForm } from "react-hook-form";
import { Plus, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { CASE_STATUSES, PRIORITIES } from "@/types/caselink";
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756

type CaseFormValues = {
  caseId: string;
  title: string;
<<<<<<< HEAD
  description: string;
  image: string;
  urls: string;
  priority: string;
  assignedAnalyst: string;
};

export function CaseForm({ initial, compact = false, commandStyle = false, currentUserName = "Local Analyst" }: { initial?: Partial<CaseFormValues> & { id?: string }; compact?: boolean; commandStyle?: boolean; currentUserName?: string }) {
  const router = useRouter();
  const [generatedCaseId] = useState(() => `INT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 8999)}`);
=======
  codename: string;
  status: string;
  priority: string;
  assignedAnalyst: string;
  tags: string;
  description: string;
};

export function CaseForm({ initial, compact = false, currentUserName = "Local Analyst" }: { initial?: Partial<CaseFormValues> & { id?: string; tags?: string[] | string }; compact?: boolean; currentUserName?: string }) {
  const router = useRouter();
  const [generatedCaseId] = useState(() => `CLB-${Math.floor(10000 + Math.random() * 89999)}`);
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
  const [error, setError] = useState("");
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<CaseFormValues>({
    defaultValues: {
      caseId: initial?.caseId ?? generatedCaseId,
      title: initial?.title ?? "",
<<<<<<< HEAD
      description: initial?.description ?? "",
      image: initial?.image ?? "",
      urls: initial?.urls ?? "",
      priority: initial?.priority ?? "Medium",
      assignedAnalyst: initial?.assignedAnalyst ?? currentUserName,
=======
      codename: initial?.codename ?? "",
      status: initial?.status ?? "Active",
      priority: initial?.priority ?? "Medium",
      assignedAnalyst: initial?.assignedAnalyst ?? currentUserName,
      tags: Array.isArray(initial?.tags) ? initial.tags.join(", ") : initial?.tags ?? "",
      description: initial?.description ?? ""
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
    }
  });

  async function onSubmit(values: CaseFormValues) {
    setError("");
<<<<<<< HEAD
    const response = await fetch(initial?.id ? `/api/cases/${initial.id}` : "/api/cases", {
      method: initial?.id ? "PATCH" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(initial?.id ? values : { ...values, codename: "Case File", status: "Active", tags: "" })
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setError(typeof body.error === "string" ? body.error : "Unable to save case.");
=======
    const endpoint = initial?.id ? `/api/cases/${initial.id}` : "/api/cases";
    const method = initial?.id ? "PATCH" : "POST";
    const response = await fetch(endpoint, {
      method,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(values)
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setError(readableError(body, response.status));
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
      return;
    }
    const saved = await response.json();
    router.refresh();
    if (!initial?.id) router.push(`/cases/${saved.id}/board`);
  }

  return (
<<<<<<< HEAD
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
=======
    <form onSubmit={handleSubmit(onSubmit)} className={compact ? "grid gap-4" : "glass-panel grid gap-4 rounded-md p-5"}>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Case title"><Input {...register("title", { required: true })} placeholder="Operation Nightfall" /></Field>
        <Field label="Codename"><Input {...register("codename", { required: true })} placeholder="Nightfall" /></Field>
        <Field label="Case ID"><Input {...register("caseId", { required: true })} placeholder="CLB-23841" /></Field>
        <Field label="Assigned analyst"><Input {...register("assignedAnalyst", { required: true })} /></Field>
        <Field label="Status"><Select {...register("status")}>{CASE_STATUSES.map((item) => <option key={item}>{item}</option>)}</Select></Field>
        <Field label="Priority"><Select {...register("priority")}>{PRIORITIES.map((item) => <option key={item}>{item}</option>)}</Select></Field>
      </div>
      <Field label="Tags"><Input {...register("tags")} placeholder="cybercrime, finance, priority-watch" /></Field>
      <Field label="Description"><Textarea {...register("description")} placeholder="Investigation summary..." /></Field>
      {error && <div className="rounded-md border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-100">{error}</div>}
      <Button type="submit" variant="primary" disabled={isSubmitting} className="w-fit">
        {initial?.id ? <Save className="size-4" /> : <Plus className="size-4" />}
        {initial?.id ? "Save Case" : "Create Case"}
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
      </Button>
    </form>
  );
}
<<<<<<< HEAD
=======

function readableError(body: unknown, status: number) {
  if (typeof body === "object" && body && "error" in body && typeof body.error === "string") {
    if (body.error === "Validation failed") return "Please fill the required fields correctly.";
    return body.error;
  }
  if (status === 409) return "Case ID is already in use.";
  return "Unable to save case.";
}
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
