"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

<<<<<<< HEAD
export function CaseDeleteButton({ id, compact = false }: { id: string; compact?: boolean }) {
=======
export function CaseDeleteButton({ id }: { id: string }) {
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
  const router = useRouter();
  async function remove() {
    const confirmed = window.confirm("Delete this case and all of its workspace data?");
    if (!confirmed) return;

    const response = await fetch(`/api/cases/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Unable to delete case.");
    router.push("/cases");
    router.refresh();
  }
<<<<<<< HEAD
  return <Button variant="danger" type="button" onClick={remove} className={compact ? "size-8 px-0" : undefined} title="Delete case"><Trash2 className="size-4" /> {!compact && "Delete Case"}</Button>;
=======
  return <Button variant="danger" type="button" onClick={remove}><Trash2 className="size-4" /> Delete Case</Button>;
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
}
