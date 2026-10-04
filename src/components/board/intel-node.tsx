"use client";

import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import Image from "next/image";
import { AlertTriangle, Banknote, Building2, Calendar, FileArchive, Globe, Laptop, MapPin, Smartphone, UserRound } from "lucide-react";
import { clsx } from "clsx";
import { initials, priorityTone } from "@/lib/format";
import type { CaseNodeRecord } from "@/types/caselink";

const iconByType = {
  Person: UserRound,
  Suspect: UserRound,
  Victim: UserRound,
  Organization: Building2,
  Location: MapPin,
  Vehicle: Smartphone,
  Device: Laptop,
  Account: Banknote,
  "Crypto Wallet": Banknote,
  "Bank Account": Banknote,
  "Website / Domain": Globe,
  "IP Address": Globe,
  Email: Globe,
  "Phone Number": Smartphone,
  "Social Media Account": Globe,
  Event: Calendar,
  Evidence: FileArchive,
  Document: FileArchive,
  "Malware Sample": AlertTriangle,
  "Custom Node": FileArchive
};

const ringByType: Record<string, string> = {
  Suspect: "border-red-400/70 shadow-red-950/50",
  Victim: "border-amber-300/60",
  Evidence: "border-amber-300/60",
  "Malware Sample": "border-red-500/70",
  Location: "border-amber-300/50",
  Organization: "border-amber-300/50",
  Device: "border-slate-300/40"
};

type IntelFlowNode = Node<{ record: CaseNodeRecord }, "intel">;

export function IntelNode({ data, selected }: NodeProps<IntelFlowNode>) {
  const node = data.record as CaseNodeRecord;
  const Icon = iconByType[node.type as keyof typeof iconByType] ?? FileArchive;

  return (
    <div className={clsx("group w-64 rounded-md border bg-slate-950/85 p-3 text-slate-100 shadow-2xl backdrop-blur transition", ringByType[node.type] ?? "border-slate-600/70", selected && "scale-[1.02] border-amber-300 shadow-amber-950/50")}>
      <Handle type="target" position={Position.Top} className="!size-2 !border-amber-200 !bg-amber-400" />
      <div className="flex gap-3">
        {node.image ? (
          <Image src={node.image} alt="" width={64} height={64} unoptimized loading="eager" className="h-16 w-16 rounded-md object-cover" />
        ) : (
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-md border border-slate-700 bg-slate-900 text-amber-200">
            {["Person", "Suspect", "Victim"].includes(node.type) ? <span className="text-lg font-bold">{initials(node.title)}</span> : <Icon className="size-7" />}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(52,211,153,.85)]" />
            <div className="truncate text-sm font-bold uppercase tracking-wide text-white">{node.title}</div>
          </div>
          <div className="mt-1 truncate text-xs font-semibold text-amber-200">{node.subtitle || node.type}</div>
          <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-300">{node.description || "No field notes recorded."}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <span className={clsx("rounded border px-1.5 py-0.5 text-[10px] uppercase tracking-[0.12em]", priorityTone(node.priority))}>{node.priority}</span>
        <span className="text-[10px] uppercase tracking-[0.14em] text-slate-500">{node.confidence}% confidence</span>
      </div>
      <Handle type="source" position={Position.Bottom} className="!size-2 !border-amber-200 !bg-amber-400" />
    </div>
  );
}
