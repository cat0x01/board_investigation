export const CASE_STATUSES = ["Active", "Pending", "Closed", "Archived"] as const;
export const PRIORITIES = ["Low", "Medium", "High", "Critical"] as const;

export const NODE_TYPES = [
  "Person",
  "Suspect",
  "Victim",
  "Organization",
  "Location",
  "Vehicle",
  "Device",
  "Account",
  "Crypto Wallet",
  "Bank Account",
  "Website / Domain",
  "IP Address",
  "Email",
  "Phone Number",
  "Social Media Account",
  "Event",
  "Evidence",
  "Document",
  "Malware Sample",
  "Custom Node"
] as const;

export const RELATION_TYPES = [
  "Works For",
  "Communicates With",
  "Owns",
  "Uses",
  "Located At",
  "Seen With",
  "Paid",
  "Transferred",
  "Related To",
  "Uploaded",
  "Downloaded",
  "Accessed",
  "Controls",
  "Associated With",
  "Travelled To",
  "Custom Relation"
] as const;

export const LINE_STYLES = ["solid", "dashed", "dotted"] as const;
export const DIRECTIONS = ["one-way", "two-way"] as const;

export type CaseStatus = (typeof CASE_STATUSES)[number];
export type Priority = (typeof PRIORITIES)[number];
export type CaseNodeType = (typeof NODE_TYPES)[number];
export type RelationType = (typeof RELATION_TYPES)[number];
export type LineStyle = (typeof LINE_STYLES)[number];
export type Direction = (typeof DIRECTIONS)[number];

export type JsonMap = Record<string, string | number | boolean | null>;

export type CaseRecord = {
  id: string;
  caseId: string;
  title: string;
  codename: string;
  status: CaseStatus | string;
  priority: Priority | string;
  assignedAnalyst: string;
  tags: string[];
  description: string;
<<<<<<< HEAD
  image: string;
  urls: string;
=======
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
  createdAt: string;
  updatedAt: string;
};

export type CaseNodeRecord = {
  id: string;
  caseId: string;
  type: CaseNodeType | string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  status: string;
  priority: string;
  tags: string[];
  source: string;
  confidence: number;
  x: number;
  y: number;
  metadata: JsonMap;
  createdAt: string;
  updatedAt: string;
};

export type CaseEdgeRecord = {
  id: string;
  caseId: string;
  sourceNodeId: string;
  targetNodeId: string;
  relationType: RelationType | string;
  shortDescription: string;
  confidence: number;
  color: string;
  lineStyle: LineStyle | string;
  direction: Direction | string;
  occurredAt: string | null;
  source: string;
  createdAt: string;
  updatedAt: string;
};

export type EvidenceRecord = {
  id: string;
  caseId: string;
  title: string;
  fileType: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  md5: string;
  sha1: string;
  sha256: string;
  source: string;
  collectedBy: string;
  collectionDate: string | null;
  chainOfCustodyNotes: string;
  relatedNodeIds: string[];
  createdAt: string;
  updatedAt: string;
};

export type TimelineEventRecord = {
  id: string;
  caseId: string;
  occurredAt: string;
  title: string;
  eventType: string;
  description: string;
  relatedNodeIds: string[];
  relatedEvidenceIds: string[];
  severity: string;
  createdAt: string;
  updatedAt: string;
};

export type NoteRecord = {
  id: string;
  caseId: string;
  title: string;
  body: string;
  tags: string[];
  pinned: boolean;
  linkedNodeIds: string[];
  createdAt: string;
  updatedAt: string;
};
