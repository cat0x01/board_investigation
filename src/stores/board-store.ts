"use client";

import { create } from "zustand";
import type { CaseEdgeRecord, CaseNodeRecord } from "@/types/caselink";

type SelectedItem =
  | { kind: "node"; id: string }
  | { kind: "edge"; id: string }
  | null;

type BoardStore = {
  nodes: CaseNodeRecord[];
  edges: CaseEdgeRecord[];
  selected: SelectedItem;
  query: string;
  typeFilter: string;
  showLabels: boolean;
  corkMode: boolean;
  setGraph: (nodes: CaseNodeRecord[], edges: CaseEdgeRecord[]) => void;
  upsertNode: (node: CaseNodeRecord) => void;
<<<<<<< HEAD
  updateNodePosition: (id: string, x: number, y: number) => void;
=======
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
  upsertEdge: (edge: CaseEdgeRecord) => void;
  removeNode: (id: string) => void;
  removeEdge: (id: string) => void;
  select: (selected: SelectedItem) => void;
  setQuery: (query: string) => void;
  setTypeFilter: (typeFilter: string) => void;
  setShowLabels: (showLabels: boolean) => void;
  setCorkMode: (corkMode: boolean) => void;
};

export const useBoardStore = create<BoardStore>((set) => ({
  nodes: [],
  edges: [],
  selected: null,
  query: "",
  typeFilter: "All",
  showLabels: true,
  corkMode: false,
<<<<<<< HEAD
  setGraph: (nodes, edges) => set({ nodes, edges, selected: null }),
  upsertNode: (node) => set((state) => ({ nodes: state.nodes.some((item) => item.id === node.id) ? state.nodes.map((item) => (item.id === node.id ? node : item)) : [node, ...state.nodes] })),
  updateNodePosition: (id, x, y) => set((state) => ({ nodes: state.nodes.map((node) => node.id === id ? { ...node, x, y } : node) })),
=======
  setGraph: (nodes, edges) => set({ nodes, edges }),
  upsertNode: (node) => set((state) => ({ nodes: state.nodes.some((item) => item.id === node.id) ? state.nodes.map((item) => (item.id === node.id ? node : item)) : [node, ...state.nodes] })),
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
  upsertEdge: (edge) => set((state) => ({ edges: state.edges.some((item) => item.id === edge.id) ? state.edges.map((item) => (item.id === edge.id ? edge : item)) : [edge, ...state.edges] })),
  removeNode: (id) => set((state) => ({ nodes: state.nodes.filter((node) => node.id !== id), edges: state.edges.filter((edge) => edge.sourceNodeId !== id && edge.targetNodeId !== id), selected: null })),
  removeEdge: (id) => set((state) => ({ edges: state.edges.filter((edge) => edge.id !== id), selected: null })),
  select: (selected) => set({ selected }),
  setQuery: (query) => set({ query }),
  setTypeFilter: (typeFilter) => set({ typeFilter }),
  setShowLabels: (showLabels) => set({ showLabels }),
  setCorkMode: (corkMode) => set({ corkMode })
}));
