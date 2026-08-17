"use client";

import "@xyflow/react/dist/style.css";
<<<<<<< HEAD
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { addEdge, Background, BackgroundVariant, Controls, MarkerType, MiniMap, ReactFlow, type Connection, type Edge, type Node, type NodeChange, type EdgeChange, applyNodeChanges, applyEdgeChanges } from "@xyflow/react";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff, Filter, Maximize, NotebookPen, Plus, Search, X } from "lucide-react";
=======
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { motion } from "framer-motion";
import { addEdge, Background, BackgroundVariant, Controls, MarkerType, MiniMap, ReactFlow, type Connection, type Edge, type Node, type NodeChange, type EdgeChange, applyNodeChanges, applyEdgeChanges } from "@xyflow/react";
import { Download, Eye, EyeOff, FileDown, FileJson, Filter, Maximize, Plus, Search, Upload } from "lucide-react";
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { DetailsDrawer } from "@/components/board/details-drawer";
import { IntelNode } from "@/components/board/intel-node";
<<<<<<< HEAD
import { GenerateReportButton } from "@/components/generate-report-button";
import { useBoardStore } from "@/stores/board-store";
import { NODE_TYPES, type CaseEdgeRecord, type CaseNodeRecord } from "@/types/caselink";
import { uploadSelectedFiles } from "@/lib/client-upload";
=======
import { useBoardStore } from "@/stores/board-store";
import { NODE_TYPES, type CaseEdgeRecord, type CaseNodeRecord } from "@/types/caselink";
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756

const nodeTypes = { intel: IntelNode };

export function BoardClient({ caseId, initialNodes, initialEdges, editable = true }: { caseId: string; initialNodes: CaseNodeRecord[]; initialEdges: CaseEdgeRecord[]; editable?: boolean }) {
  const store = useBoardStore();
<<<<<<< HEAD
  const { nodes, edges, query, typeFilter, showLabels, corkMode, setGraph, updateNodePosition } = store;
  const [rfNodes, setRfNodes] = useState<Node[]>([]);
  const [rfEdges, setRfEdges] = useState<Edge[]>([]);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
=======
  const { nodes, edges, query, typeFilter, showLabels, corkMode, setGraph } = store;
  const [rfNodes, setRfNodes] = useState<Node[]>([]);
  const [rfEdges, setRfEdges] = useState<Edge[]>([]);
  const [creating, setCreating] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756

  useEffect(() => {
    setGraph(initialNodes, initialEdges);
  }, [initialEdges, initialNodes, setGraph]);

  const filteredNodeIds = useMemo(() => new Set(nodes.filter((node) => (typeFilter === "All" || node.type === typeFilter) && (!query || `${node.title} ${node.subtitle} ${node.description} ${(node.tags || []).join(" ")}`.toLowerCase().includes(query.toLowerCase()))).map((node) => node.id)), [nodes, query, typeFilter]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
<<<<<<< HEAD
    setRfNodes(nodes.filter((node) => node && typeof node.id === "string" && node.id.length > 0).map((node) => {
=======
    setRfNodes(nodes.map((node) => {
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
      const dim = query || typeFilter !== "All" ? !filteredNodeIds.has(node.id) : false;
      return {
        id: node.id,
        type: "intel",
<<<<<<< HEAD
        position: {
          x: Number.isFinite(node.x) ? node.x : 0,
          y: Number.isFinite(node.y) ? node.y : 0
        },
=======
        position: { x: node.x, y: node.y },
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
        data: { record: node },
        style: { opacity: dim ? 0.25 : 1 }
      };
    }));
    setRfEdges(edges.map((edge) => ({
      id: edge.id,
      source: edge.sourceNodeId,
      target: edge.targetNodeId,
      label: showLabels ? edge.relationType : "",
<<<<<<< HEAD
      labelStyle: { fill: "#fde047", fontSize: 11, fontWeight: 700 },
      labelBgStyle: { fill: "#050505", fillOpacity: 0.96, stroke: "rgba(250,204,21,.55)", strokeWidth: 1 },
      labelBgPadding: [7, 4] as [number, number],
      labelBgBorderRadius: 4,
      animated: edge.lineStyle === "dashed",
      markerEnd: edge.direction === "one-way" ? { type: MarkerType.ArrowClosed, color: "#facc15" } : undefined,
      markerStart: edge.direction === "two-way" ? { type: MarkerType.ArrowClosed, color: "#facc15" } : undefined,
      style: {
        stroke: "#facc15",
=======
      animated: edge.lineStyle === "dashed",
      markerEnd: edge.direction === "one-way" ? { type: MarkerType.ArrowClosed, color: edge.color } : undefined,
      markerStart: edge.direction === "two-way" ? { type: MarkerType.ArrowClosed, color: edge.color } : undefined,
      style: {
        stroke: edge.color,
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
        strokeWidth: 2,
        strokeDasharray: edge.lineStyle === "dashed" ? "8 8" : edge.lineStyle === "dotted" ? "2 7" : undefined,
        opacity: query || typeFilter !== "All" ? filteredNodeIds.has(edge.sourceNodeId) && filteredNodeIds.has(edge.targetNodeId) ? 1 : 0.18 : 1
      },
      data: { record: edge }
    })));
  }, [edges, filteredNodeIds, nodes, query, showLabels, typeFilter]);

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setRfNodes((current) => applyNodeChanges(changes, current));
<<<<<<< HEAD
  }, []);

  const onNodeDragStop = useCallback((_: React.MouseEvent, node: Node) => {
    if (!editable) return;
    const { x, y } = node.position;
    if (!Number.isFinite(x) || !Number.isFinite(y)) return;
    updateNodePosition(node.id, x, y);
    void fetch(`/api/nodes/${node.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ x, y })
    });
  }, [editable, updateNodePosition]);
=======
    if (!editable) return;
    const positionChanges = changes.filter((change) => change.type === "position" && change.position);
    if (positionChanges.length > 0) {
      positionChanges.forEach((change) => {
        if (change.type === "position" && change.position) {
          const existing = nodes.find((node) => node.id === change.id);
          if (existing) store.upsertNode({ ...existing, x: change.position.x, y: change.position.y });
        }
      });
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        positionChanges.forEach((change) => {
          if (change.type === "position" && change.position) {
            fetch(`/api/nodes/${change.id}`, {
              method: "PATCH",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ x: change.position.x, y: change.position.y })
            });
          }
        });
      }, 550);
    }
  }, [editable, nodes, store]);
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756

  const onEdgesChange = useCallback((changes: EdgeChange[]) => setRfEdges((current) => applyEdgeChanges(changes, current)), []);

  const onConnect = useCallback(async (connection: Connection) => {
    if (!editable) return;
    if (!connection.source || !connection.target) return;
    const response = await fetch(`/api/cases/${caseId}/edges`, {
      method: "POST",
      headers: { "content-type": "application/json" },
<<<<<<< HEAD
      body: JSON.stringify({ sourceNodeId: connection.source, targetNodeId: connection.target, relationType: "Related To", color: "#facc15" })
    });
    const edge = await response.json();
    if (!response.ok) return;
=======
      body: JSON.stringify({ sourceNodeId: connection.source, targetNodeId: connection.target, relationType: "Related To", color: "#38bdf8" })
    });
    const edge = await response.json();
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
    store.upsertEdge(edge);
    setRfEdges((current) => addEdge({ ...connection, id: edge.id }, current));
  }, [caseId, editable, store]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") store.select(null);
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        if (!editable) return;
        rfNodes.forEach((node) => fetch(`/api/nodes/${node.id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ x: node.position.x, y: node.position.y }) }));
      }
<<<<<<< HEAD
=======
      if (event.key === "Delete" || event.key === "Backspace") {
        if (!editable) return;
        const selectedNode = rfNodes.find((node) => node.selected);
        const selectedEdge = rfEdges.find((edge) => edge.selected);
        if (selectedNode) fetch(`/api/nodes/${selectedNode.id}`, { method: "DELETE" }).then(() => store.removeNode(selectedNode.id));
        if (selectedEdge) fetch(`/api/edges/${selectedEdge.id}`, { method: "DELETE" }).then(() => store.removeEdge(selectedEdge.id));
      }
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [editable, rfEdges, rfNodes, store]);

  async function createNode(formData: FormData) {
    if (!editable) return;
<<<<<<< HEAD
    setCreateError("");
    let uploadedImages: Awaited<ReturnType<typeof uploadSelectedFiles>> = [];
    let uploadedFiles: Awaited<ReturnType<typeof uploadSelectedFiles>> = [];
    try {
      uploadedImages = await uploadSelectedFiles(formData.getAll("imageFiles").filter((entry): entry is File => entry instanceof File && entry.size > 0));
      uploadedFiles = await uploadSelectedFiles(formData.getAll("documentFiles").filter((entry): entry is File => entry instanceof File && entry.size > 0));
    } catch (error) {
      setCreateError(error instanceof Error ? error.message : "Upload failed.");
      return;
    }
    const enteredImage = String(formData.get("image") || "");
    const enteredFiles = String(formData.get("files") || "");
=======
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
    const response = await fetch(`/api/cases/${caseId}/nodes`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        title: String(formData.get("title") || "Untitled Node"),
        type: String(formData.get("type") || "Custom Node"),
        subtitle: String(formData.get("subtitle") || ""),
        description: String(formData.get("description") || ""),
<<<<<<< HEAD
        image: enteredImage || uploadedImages[0]?.url || "",
        status: String(formData.get("status") || "Active"),
        priority: String(formData.get("priority") || "Medium"),
        source: String(formData.get("source") || ""),
        tags: String(formData.get("tags") || ""),
        confidence: Number(formData.get("confidence") || 80),
        metadata: {
          alias: String(formData.get("alias") || ""),
          location: String(formData.get("location") || ""),
          contact: String(formData.get("contact") || ""),
          identifier: String(formData.get("identifier") || ""),
          socialAccounts: String(formData.get("socialAccounts") || ""),
          galleryImages: uploadedImages.map((file) => file.url).join("\n"),
          files: [enteredFiles, ...uploadedFiles.map((file) => `${file.name}::${file.url}`)].filter(Boolean).join("\n"),
          intelligenceNotes: String(formData.get("intelligenceNotes") || ""),
        },
=======
        priority: String(formData.get("priority") || "Medium"),
        confidence: Number(formData.get("confidence") || 80),
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
        x: 160 + Math.random() * 420,
        y: 120 + Math.random() * 260
      })
    });
<<<<<<< HEAD
    const result = await response.json().catch(() => null);
    if (!response.ok) {
      const fieldErrors = result?.details?.fieldErrors as Record<string, string[] | undefined> | undefined;
      const detail = fieldErrors
        ? Object.entries(fieldErrors).flatMap(([field, messages]) => (messages ?? []).map((message) => `${field}: ${message}`))[0]
        : undefined;
      setCreateError(detail || result?.error || "Unable to create this node.");
      return;
    }
    if (!result || typeof result.id !== "string" || !Number.isFinite(result.x) || !Number.isFinite(result.y)) {
      setCreateError("The server returned an invalid node.");
      return;
    }
    store.upsertNode(result as CaseNodeRecord);
    setCreating(false);
  }

  return (
    <div className="relative h-[calc(100vh-5rem)] overflow-hidden">
      <div className="absolute inset-x-0 top-0 z-10 flex flex-wrap items-center gap-3 border-b border-slate-800/90 bg-slate-950/70 p-4 backdrop-blur">
        <Link href="/cases" className="grid size-10 place-items-center rounded-lg border border-slate-800 text-slate-400 hover:text-white" title="Back to cases"><ArrowLeft className="size-4" /></Link>
        <div className="relative min-w-52 flex-1">
=======
    store.upsertNode(await response.json());
    setCreating(false);
  }

  async function exportCaseJson() {
    const response = await fetch(`/api/export/case/${caseId}`, { method: "POST" });
    downloadBlob(JSON.stringify(await response.json(), null, 2), `caselink-case-${caseId}.json`, "application/json");
  }

  function exportBoardJson() {
    downloadBlob(JSON.stringify({ nodes, edges }, null, 2), `caselink-board-${caseId}.json`, "application/json");
  }

  async function exportPng() {
    if (!boardRef.current) return;
    const url = await toPng(boardRef.current, { cacheBust: true, backgroundColor: "#05070b" });
    const link = document.createElement("a");
    link.href = url;
    link.download = `caselink-board-${caseId}.png`;
    link.click();
  }

  function exportPdf() {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("CAT0X01 INVESTIGATIOONS Case Summary", 18, 20);
    doc.setFontSize(11);
    doc.text(`Nodes: ${nodes.length}`, 18, 34);
    doc.text(`Relations: ${edges.length}`, 18, 42);
    nodes.slice(0, 32).forEach((node, index) => doc.text(`${index + 1}. ${node.title} (${node.type}) - ${node.confidence}%`, 18, 56 + index * 7));
    doc.save(`caselink-summary-${caseId}.pdf`);
  }

  return (
    <div className="relative h-[calc(100vh-5rem)] overflow-hidden" ref={boardRef}>
      <div className="absolute inset-x-0 top-0 z-10 flex flex-wrap items-center gap-3 border-b border-slate-800/90 bg-slate-950/70 p-4 backdrop-blur">
        <div className="relative min-w-64 flex-1">
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
          <Input value={query} onChange={(event) => store.setQuery(event.target.value)} className="pl-9" placeholder="Search board nodes..." />
        </div>
        <Select value={typeFilter} onChange={(event) => store.setTypeFilter(event.target.value)} aria-label="Filter by type">
          <option>All</option>
          {NODE_TYPES.map((item) => <option key={item}>{item}</option>)}
        </Select>
<<<<<<< HEAD
        {editable ? <Button onClick={() => { setCreateError(""); setCreating(true); }} variant="primary"><Plus className="size-4" /> Add Node</Button> : <span className="rounded-md border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-sm text-amber-100">Read-only</span>}
        <Button onClick={() => store.setShowLabels(!showLabels)}>{showLabels ? <Eye className="size-4" /> : <EyeOff className="size-4" />} Labels</Button>
        <Button onClick={() => store.setCorkMode(!corkMode)}><Filter className="size-4" /> Texture</Button>
        <Link href={`/cases/${caseId}/notes`} className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-700 px-3 text-sm text-slate-200"><NotebookPen className="size-4" /> Notes</Link>
        <GenerateReportButton caseId={caseId} />
=======
        {editable ? <Button onClick={() => setCreating(true)} variant="primary"><Plus className="size-4" /> Add Node</Button> : <span className="rounded-md border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-sm text-amber-100">Read-only</span>}
        <Button onClick={() => store.setShowLabels(!showLabels)}>{showLabels ? <Eye className="size-4" /> : <EyeOff className="size-4" />} Labels</Button>
        <Button onClick={() => store.setCorkMode(!corkMode)}><Filter className="size-4" /> Texture</Button>
        <Button onClick={exportPng}><Download className="size-4" /> PNG</Button>
        <Button onClick={exportPdf}><FileDown className="size-4" /> PDF</Button>
        <Button onClick={exportCaseJson}><FileJson className="size-4" /> Case</Button>
        <Button onClick={exportBoardJson}><Upload className="size-4" /> Board</Button>
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
      </div>

      <div className={`absolute inset-0 pt-[86px] ${corkMode ? "cork-board" : "intel-grid"}`}>
        <ReactFlow
          nodes={rfNodes}
          edges={rfEdges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
<<<<<<< HEAD
          onNodeDragStop={onNodeDragStop}
=======
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
          onEdgesChange={onEdgesChange}
          onConnect={editable ? onConnect : undefined}
          nodesDraggable={editable}
          nodesConnectable={editable}
          elementsSelectable
<<<<<<< HEAD
          deleteKeyCode={null}
=======
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
          onNodeClick={(_, node) => store.select({ kind: "node", id: node.id })}
          onNodeDoubleClick={(_, node) => store.select({ kind: "node", id: node.id })}
          onEdgeClick={(_, edge) => store.select({ kind: "edge", id: edge.id })}
          fitView
          minZoom={0.2}
          maxZoom={1.8}
          proOptions={{ hideAttribution: true }}
        >
          <Background variant={BackgroundVariant.Dots} gap={28} size={1} color="rgba(148,163,184,.28)" />
          <MiniMap pannable zoomable nodeColor={(node) => node.selected ? "#22d3ee" : "#475569"} maskColor="rgba(2,6,23,.72)" className="!border !border-slate-700 !bg-slate-950/80" />
          <Controls className="!border !border-slate-700 !bg-slate-950/80 !text-slate-100" />
        </ReactFlow>
      </div>

      {creating && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
<<<<<<< HEAD
          <motion.div initial={{ opacity: 0, y: 18, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="max-h-[92vh] w-full max-w-2xl overflow-auto">
            <form onSubmit={(event) => { event.preventDefault(); void createNode(new FormData(event.currentTarget)); }} className="glass-panel grid gap-5 rounded-xl p-6">
              <div className="flex items-start justify-between"><div><div className="text-xs font-semibold uppercase tracking-[.2em] text-amber-400">Intelligence record</div><h2 className="mt-2 text-xl font-bold text-white">Add Board Node</h2></div><button type="button" onClick={() => setCreating(false)} className="grid size-9 place-items-center rounded-lg border border-slate-700 text-slate-400"><X className="size-4" /></button></div>
              <div className="grid gap-4 md:grid-cols-2"><Field label="Title / Full name"><Input name="title" required placeholder="Primary identity" /></Field><Field label="Node type"><Select name="type">{NODE_TYPES.map((item) => <option key={item}>{item}</option>)}</Select></Field></div>
              <div className="grid gap-4 md:grid-cols-2"><Field label="Subtitle / Role"><Input name="subtitle" placeholder="Role, occupation or short label" /></Field><Field label="Alias"><Input name="alias" placeholder="Known alias or username" /></Field></div>
              <Field label="Description"><Textarea name="description" /></Field>
              <div className="grid gap-4 md:grid-cols-2"><Field label="Image URL"><Input name="image" placeholder="https://..." /></Field><Field label="Source URL / Reference"><Input name="source" placeholder="Source of intelligence" /></Field></div>
              <Field label="Upload person images"><Input name="imageFiles" type="file" accept="image/*" multiple /></Field>
              <div className="grid gap-4 md:grid-cols-3"><Field label="Location"><Input name="location" /></Field><Field label="Contact"><Input name="contact" placeholder="Email, phone, handle" /></Field><Field label="Identifier"><Input name="identifier" placeholder="ID, wallet, domain..." /></Field></div>
              <div className="grid gap-4 md:grid-cols-2"><Field label="Social accounts"><Textarea name="socialAccounts" placeholder="One profile URL or @handle per line" /></Field><Field label="File references"><Textarea name="files" placeholder="One file name or URL per line" /></Field></div>
              <Field label="Upload files & documents"><Input name="documentFiles" type="file" multiple /></Field>
              <Field label="Intelligence notes"><Textarea name="intelligenceNotes" placeholder="Additional observations, leads and analysis" /></Field>
              <div className="grid gap-4 md:grid-cols-2"><Field label="Tags"><Input name="tags" placeholder="alias, finance, verified" /></Field><Field label="Status"><Select name="status"><option>Active</option><option>Under Review</option><option>Verified</option><option>Inactive</option><option>Unknown</option></Select></Field></div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Priority"><Select name="priority"><option>Medium</option><option>High</option><option>Critical</option><option>Low</option></Select></Field>
                <Field label="Confidence"><Input name="confidence" type="number" min={0} max={100} defaultValue={80} /></Field>
              </div>
              {createError && <p role="alert" className="rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-200">{createError}</p>}
              <div className="flex justify-end gap-2 border-t border-slate-800 pt-4">
=======
          <motion.div initial={{ opacity: 0, y: 18, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="w-full max-w-lg">
            <form action={createNode} className="glass-panel grid gap-4 rounded-md p-5">
              <h2 className="text-xl font-bold text-white">Add Intelligence Node</h2>
              <Field label="Title"><Input name="title" required /></Field>
              <Field label="Type"><Select name="type">{NODE_TYPES.map((item) => <option key={item}>{item}</option>)}</Select></Field>
              <Field label="Subtitle"><Input name="subtitle" /></Field>
              <Field label="Description"><Textarea name="description" /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Priority"><Select name="priority"><option>Medium</option><option>High</option><option>Critical</option><option>Low</option></Select></Field>
                <Field label="Confidence"><Input name="confidence" type="number" min={0} max={100} defaultValue={80} /></Field>
              </div>
              <div className="flex justify-end gap-2">
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
                <Button type="button" onClick={() => setCreating(false)}>Cancel</Button>
                <Button type="submit" variant="primary"><Plus className="size-4" /> Create</Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

<<<<<<< HEAD
      <DetailsDrawer caseId={caseId} editable={editable} />
=======
      <DetailsDrawer editable={editable} />
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
      <div className="pointer-events-none absolute bottom-5 right-5 z-10 rounded-md border border-slate-800 bg-slate-950/75 p-3 text-xs text-slate-400 backdrop-blur">
        <div className="flex items-center gap-2 text-slate-200"><Maximize className="size-3" /> Drag to connect, double-click to inspect</div>
      </div>
    </div>
  );
}
<<<<<<< HEAD
=======

function downloadBlob(contents: string, name: string, type: string) {
  const blob = new Blob([contents], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
