"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ImportCaseForm() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  async function importFile() {
    const file = inputRef.current?.files?.[0];
    if (!file) return;
    const payload = JSON.parse(await file.text());
    const response = await fetch("/api/import/case", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error("Import failed.");
    const created = await response.json();
    router.push(`/cases/${created.id}/board`);
    router.refresh();
  }

  return (
    <div className="rounded-md border border-slate-800 bg-slate-950/60 p-3">
      <div className="mb-3 font-medium text-white">Import case or board JSON</div>
      <input ref={inputRef} type="file" accept="application/json,.json" className="mb-3 block w-full text-sm text-slate-300" />
      <Button onClick={importFile} type="button"><Upload className="size-4" /> Import JSON</Button>
    </div>
  );
}
