"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CaseDeleteButton({ id, compact = false }: { id: string; compact?: boolean }) {
  const router = useRouter();
  async function remove() {
    const confirmed = window.confirm("Delete this case and all of its workspace data?");
    if (!confirmed) return;

    const response = await fetch(`/api/cases/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Unable to delete case.");
    router.push("/cases");
    router.refresh();
  }
  return <Button variant="danger" type="button" onClick={remove} className={compact ? "size-8 px-0" : undefined} title="Delete case"><Trash2 className="size-4" /> {!compact && "Delete Case"}</Button>;
}
