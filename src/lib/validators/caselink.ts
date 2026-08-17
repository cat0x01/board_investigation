import { z } from "zod";
import { CASE_STATUSES, DIRECTIONS, LINE_STYLES, NODE_TYPES, PRIORITIES, RELATION_TYPES } from "@/types/caselink";

const csvOrArray = z.preprocess((value) => {
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return value;
<<<<<<< HEAD
}, z.array(z.string().min(1)));

export const jsonMapSchema = z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()]));

const casePatchFields = {
  caseId: z.string().trim().min(2).max(40),
  title: z.string().trim().min(2).max(120),
  codename: z.string().trim().max(80),
  status: z.enum(CASE_STATUSES),
  priority: z.enum(PRIORITIES),
  assignedAnalyst: z.string().trim().min(1).max(80),
  tags: csvOrArray,
  description: z.string().max(4000),
  image: z.string().trim(),
  urls: z.string().max(4000)
};
=======
}, z.array(z.string().min(1)).default([]));

export const jsonMapSchema = z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()])).default({});
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756

export const caseSchema = z.object({
  caseId: z.string().trim().min(2).max(40),
  title: z.string().trim().min(2).max(120),
<<<<<<< HEAD
  codename: z.string().trim().max(80).default("Case File"),
  status: z.enum(CASE_STATUSES).default("Active"),
  priority: z.enum(PRIORITIES).default("Medium"),
  assignedAnalyst: z.string().trim().min(1).max(80).default("Local Analyst"),
  tags: csvOrArray.default([]),
  description: z.string().max(4000).default(""),
  image: z.string().trim().default(""),
  urls: z.string().max(4000).default("")
});

export const casePatchSchema = z.object(casePatchFields).partial();

const nodePatchFields = {
  type: z.enum(NODE_TYPES).or(z.string().trim().min(1)),
  title: z.string().trim().min(1).max(140),
  subtitle: z.string().max(160),
  description: z.string().max(4000),
  image: z.string(),
  status: z.string().max(80),
  priority: z.enum(PRIORITIES).or(z.string().max(80)),
  tags: csvOrArray,
  source: z.string().max(400),
  confidence: z.coerce.number().int().min(0).max(100),
  x: z.coerce.number().finite(),
  y: z.coerce.number().finite(),
  metadata: jsonMapSchema
};
=======
  codename: z.string().trim().min(2).max(80),
  status: z.enum(CASE_STATUSES).default("Active"),
  priority: z.enum(PRIORITIES).default("Medium"),
  assignedAnalyst: z.string().trim().min(1).max(80).default("Local Analyst"),
  tags: csvOrArray,
  description: z.string().max(4000).default("")
});

export const casePatchSchema = caseSchema.partial();
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756

export const nodeSchema = z.object({
  type: z.enum(NODE_TYPES).or(z.string().trim().min(1)).default("Custom Node"),
  title: z.string().trim().min(1).max(140),
  subtitle: z.string().max(160).default(""),
  description: z.string().max(4000).default(""),
<<<<<<< HEAD
  image: z.string().default(""),
  status: z.string().max(80).default("Active"),
  priority: z.enum(PRIORITIES).or(z.string().max(80)).default("Medium"),
  tags: csvOrArray.default([]),
=======
  image: z.string().max(500).default(""),
  status: z.string().max(80).default("Active"),
  priority: z.enum(PRIORITIES).or(z.string().max(80)).default("Medium"),
  tags: csvOrArray,
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
  source: z.string().max(400).default(""),
  confidence: z.coerce.number().int().min(0).max(100).default(80),
  x: z.coerce.number().finite().default(0),
  y: z.coerce.number().finite().default(0),
<<<<<<< HEAD
  metadata: jsonMapSchema.default({})
});

export const nodePatchSchema = z.object(nodePatchFields).partial();

const edgePatchFields = {
  sourceNodeId: z.string().min(1),
  targetNodeId: z.string().min(1),
  relationType: z.enum(RELATION_TYPES).or(z.string().trim().min(1)),
  shortDescription: z.string().max(1000),
  confidence: z.coerce.number().int().min(0).max(100),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  lineStyle: z.enum(LINE_STYLES),
  direction: z.enum(DIRECTIONS),
  occurredAt: z.coerce.date().nullable().optional(),
  source: z.string().max(400)
};
=======
  metadata: jsonMapSchema
});

export const nodePatchSchema = nodeSchema.partial();
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756

export const edgeSchema = z.object({
  sourceNodeId: z.string().min(1),
  targetNodeId: z.string().min(1),
  relationType: z.enum(RELATION_TYPES).or(z.string().trim().min(1)).default("Related To"),
  shortDescription: z.string().max(1000).default(""),
  confidence: z.coerce.number().int().min(0).max(100).default(75),
<<<<<<< HEAD
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).default("#facc15"),
=======
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).default("#38bdf8"),
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
  lineStyle: z.enum(LINE_STYLES).default("solid"),
  direction: z.enum(DIRECTIONS).default("one-way"),
  occurredAt: z.coerce.date().nullable().optional(),
  source: z.string().max(400).default("")
});

<<<<<<< HEAD
export const edgePatchSchema = z.object(edgePatchFields).partial();
=======
export const edgePatchSchema = edgeSchema.partial();
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756

export const evidenceSchema = z.object({
  title: z.string().trim().min(1).max(160),
  fileType: z.string().trim().max(80).default("Document"),
  fileName: z.string().max(240).default(""),
  filePath: z.string().max(500).default(""),
  fileSize: z.coerce.number().int().min(0).max(10_000_000).default(0),
  md5: z.string().max(64).default(""),
  sha1: z.string().max(80).default(""),
  sha256: z.string().max(100).default(""),
  source: z.string().max(400).default(""),
  collectedBy: z.string().max(120).default(""),
  collectionDate: z.coerce.date().nullable().optional(),
  chainOfCustodyNotes: z.string().max(5000).default(""),
<<<<<<< HEAD
  relatedNodeIds: csvOrArray.default([])
=======
  relatedNodeIds: csvOrArray
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
});

export const evidencePatchSchema = evidenceSchema.partial();

export const timelineSchema = z.object({
  occurredAt: z.coerce.date(),
  title: z.string().trim().min(1).max(160),
  eventType: z.string().trim().min(1).max(80),
  description: z.string().max(4000).default(""),
<<<<<<< HEAD
  relatedNodeIds: csvOrArray.default([]),
  relatedEvidenceIds: csvOrArray.default([]),
=======
  relatedNodeIds: csvOrArray,
  relatedEvidenceIds: csvOrArray,
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
  severity: z.string().max(80).default("Medium")
});

export const noteSchema = z.object({
  title: z.string().trim().min(1).max(160),
  body: z.string().max(30000),
<<<<<<< HEAD
  tags: csvOrArray.default([]),
  pinned: z.coerce.boolean().default(false),
  linkedNodeIds: csvOrArray.default([])
=======
  tags: csvOrArray,
  pinned: z.coerce.boolean().default(false),
  linkedNodeIds: csvOrArray
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
});

export const importCaseSchema = z.object({
  case: caseSchema.partial().extend({
    caseId: z.string().trim().min(2).max(40),
    title: z.string().trim().min(2).max(120),
    codename: z.string().trim().min(2).max(80)
  }),
  nodes: z.array(nodeSchema.extend({ id: z.string().optional() })).default([]),
  edges: z.array(edgeSchema.extend({ id: z.string().optional() })).default([]),
  evidence: z.array(evidenceSchema).default([]),
  timelineEvents: z.array(timelineSchema).default([]),
  notes: z.array(noteSchema).default([])
});
