"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export function EvidenceDeleteButton({ id }: { id: string }) {
  const router = useRouter();
  async function remove() {
    await fetch(`/api/evidence/${id}`, { method: "DELETE" });
    router.refresh();
  }
  return (
    <button onClick={remove} className="inline-flex h-9 items-center gap-2 rounded-md border border-red-500/30 px-3 text-sm text-red-100">
      <Trash2 className="size-4" /> Delete
    </button>
  );
}
