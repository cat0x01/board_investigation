type StringRecord = Record<string, unknown>;

function parseJson<T>(value: unknown, fallback: T): T {
  if (typeof value !== "string") return (value as T) ?? fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function stringify(value: unknown, fallback: unknown) {
  if (typeof value === "string") return value;
  return JSON.stringify(value ?? fallback);
}

export function encodeCaseData<T extends StringRecord>(data: T): Omit<T, "tags"> & { tags?: string } {
  const { tags, ...rest } = data;
  return { ...rest, ...("tags" in data ? { tags: stringify(tags, []) } : {}) };
}

export function parseCase<T extends StringRecord>(record: T) {
  return { ...record, tags: parseJson<string[]>(record.tags, []) };
}

export function encodeNodeData<T extends StringRecord>(data: T): Omit<T, "tags" | "metadata"> & { tags?: string; metadata?: string } {
  const { tags, metadata, ...rest } = data;
  return {
    ...rest,
    ...("tags" in data ? { tags: stringify(tags, []) } : {}),
    ...("metadata" in data ? { metadata: stringify(metadata, {}) } : {})
  };
}

export function parseNode<T extends StringRecord>(record: T) {
  return { ...record, tags: parseJson<string[]>(record.tags, []), metadata: parseJson<Record<string, unknown>>(record.metadata, {}) };
}

export function encodeEvidenceData<T extends StringRecord>(data: T): Omit<T, "relatedNodeIds"> & { relatedNodeIds?: string } {
  const { relatedNodeIds, ...rest } = data;
  return { ...rest, ...("relatedNodeIds" in data ? { relatedNodeIds: stringify(relatedNodeIds, []) } : {}) };
}

export function parseEvidence<T extends StringRecord>(record: T) {
  return { ...record, relatedNodeIds: parseJson<string[]>(record.relatedNodeIds, []) };
}

export function encodeTimelineData<T extends StringRecord>(data: T): Omit<T, "relatedNodeIds" | "relatedEvidenceIds"> & { relatedNodeIds?: string; relatedEvidenceIds?: string } {
  const { relatedNodeIds, relatedEvidenceIds, ...rest } = data;
  return {
    ...rest,
    ...("relatedNodeIds" in data ? { relatedNodeIds: stringify(relatedNodeIds, []) } : {}),
    ...("relatedEvidenceIds" in data ? { relatedEvidenceIds: stringify(relatedEvidenceIds, []) } : {})
  };
}

export function parseTimeline<T extends StringRecord>(record: T) {
  return {
    ...record,
    relatedNodeIds: parseJson<string[]>(record.relatedNodeIds, []),
    relatedEvidenceIds: parseJson<string[]>(record.relatedEvidenceIds, [])
  };
}

export function encodeNoteData<T extends StringRecord>(data: T): Omit<T, "tags" | "linkedNodeIds"> & { tags?: string; linkedNodeIds?: string } {
  const { tags, linkedNodeIds, ...rest } = data;
  return {
    ...rest,
    ...("tags" in data ? { tags: stringify(tags, []) } : {}),
    ...("linkedNodeIds" in data ? { linkedNodeIds: stringify(linkedNodeIds, []) } : {})
  };
}

export function parseNote<T extends StringRecord>(record: T) {
  return { ...record, tags: parseJson<string[]>(record.tags, []), linkedNodeIds: parseJson<string[]>(record.linkedNodeIds, []) };
}

export function encodeActivityDetails(details: unknown) {
  return stringify(details, {});
}
