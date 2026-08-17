"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Share2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type User = { id: string; name: string; email: string; role: string };
type Share = { id: string; userId: string; access: string; user: User };

export function ShareCasePanel({ caseId, users, shares, ownerId }: { caseId: string; users: User[]; shares: Share[]; ownerId: string | null }) {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [access, setAccess] = useState("Viewer");
  const [isSaving, setIsSaving] = useState(false);

  const shareableUsers = useMemo(() => {
    const sharedUserIds = new Set(shares.map((share) => share.userId));
    return users.filter((user) => user.id !== ownerId && !sharedUserIds.has(user.id));
  }, [ownerId, shares, users]);

  async function shareCase() {
    if (!userId) return;
    setIsSaving(true);
    const response = await fetch(`/api/cases/${caseId}/shares`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ userId, access })
    });
    setIsSaving(false);
    if (!response.ok) return;
    setUserId("");
    router.refresh();
  }

  async function removeShare(targetUserId: string) {
    const response = await fetch(`/api/cases/${caseId}/shares?userId=${encodeURIComponent(targetUserId)}`, { method: "DELETE" });
    if (response.ok) router.refresh();
  }

  return (
    <div className="glass-panel rounded-md p-5">
      <div className="flex items-center gap-2">
        <Share2 className="size-4 text-cyan-300" />
        <h2 className="text-lg font-semibold text-white">Share Case & Board</h2>
      </div>
      <div className="mt-4 grid gap-3">
        <select value={userId} onChange={(event) => setUserId(event.target.value)} className="h-10 rounded-md border border-slate-800 bg-slate-950/70 px-3 text-sm text-slate-100 outline-none focus:border-cyan-400/60">
          <option value="">Select user</option>
          {shareableUsers.map((user) => <option key={user.id} value={user.id}>{user.name} - {user.role}</option>)}
        </select>
        <div className="grid grid-cols-[1fr_auto] gap-2">
          <select value={access} onChange={(event) => setAccess(event.target.value)} className="h-10 rounded-md border border-slate-800 bg-slate-950/70 px-3 text-sm text-slate-100 outline-none focus:border-cyan-400/60">
            <option>Viewer</option>
            <option>Editor</option>
          </select>
          <Button type="button" variant="primary" disabled={!userId || isSaving} onClick={shareCase}>
            <Share2 className="size-4" />
            Share
          </Button>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {shares.map((share) => (
          <div key={share.id} className="flex items-center justify-between gap-3 rounded-md border border-slate-800 bg-slate-950/50 px-3 py-2">
            <div>
              <div className="text-sm font-medium text-white">{share.user.name}</div>
              <div className="text-xs text-slate-400">{share.access}</div>
            </div>
            <button type="button" onClick={() => removeShare(share.userId)} className="grid size-8 place-items-center rounded-md border border-red-400/30 text-red-200 hover:bg-red-500/10" aria-label={`Remove ${share.user.name}`}>
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
        {shares.length === 0 && <p className="text-sm text-slate-400">No shared users yet.</p>}
      </div>
    </div>
  );
}
