import { ok, fail, handleError, logActivity } from "@/lib/api";
import { getCurrentUserFromRequest } from "@/lib/current-user";
import { prisma } from "@/lib/db/prisma";
import { encodeCaseData, encodeEvidenceData, encodeNodeData, encodeNoteData, encodeTimelineData, parseCase } from "@/lib/db/serde";
import { importCaseSchema } from "@/lib/validators/caselink";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUserFromRequest(request);
    if (!user) return fail("Authentication required.", 401);
    const raw = await request.json().catch(() => ({}));
    const normalized = raw.case
      ? raw
      : {
          case: {
            caseId: `IMPORT-${Date.now().toString().slice(-6)}`,
            title: "Imported Board",
            codename: "Imported",
            assignedAnalyst: user.name,
            status: "Active",
            priority: "Medium",
            description: "Board JSON imported into a new CAT0X01 INVESTIGATIOONS case."
          },
          nodes: raw.nodes ?? [],
          edges: raw.edges ?? [],
          evidence: [],
          timelineEvents: [],
          notes: []
        };
    const payload = importCaseSchema.parse(normalized);
    const created = await prisma.$transaction(async (tx) => {
      const importedCase = await tx.case.create({
        data: {
          status: payload.case.status ?? "Active",
          priority: payload.case.priority ?? "Medium",
          assignedAnalyst: payload.case.assignedAnalyst ?? user.name,
          userId: user.id,
          description: payload.case.description ?? "",
          ...encodeCaseData(payload.case),
          caseId: `${payload.case.caseId}-${Date.now().toString().slice(-5)}`
        }
      });

      const idMap = new Map<string, string>();
      for (const node of payload.nodes) {
        const { id: oldId, ...nodeData } = node;
        const createdNode = await tx.caseNode.create({ data: { ...encodeNodeData(nodeData), caseId: importedCase.id } });
        if (oldId) idMap.set(oldId, createdNode.id);
      }

      for (const edge of payload.edges) {
        const { sourceNodeId, targetNodeId, ...edgeDataWithId } = edge;
        const { id, ...edgeData } = edgeDataWithId;
        void id;
        const source = idMap.get(sourceNodeId);
        const target = idMap.get(targetNodeId);
        if (source && target) {
          await tx.caseEdge.create({ data: { ...edgeData, sourceNodeId: source, targetNodeId: target, caseId: importedCase.id } });
        }
      }

      for (const evidence of payload.evidence) await tx.evidence.create({ data: { ...encodeEvidenceData(evidence), caseId: importedCase.id } });
      for (const event of payload.timelineEvents) await tx.timelineEvent.create({ data: { ...encodeTimelineData(event), caseId: importedCase.id } });
      for (const note of payload.notes) await tx.note.create({ data: { ...encodeNoteData(note), caseId: importedCase.id } });
      return importedCase;
    });

    await logActivity(created.id, "imported", "case", created.id, { title: created.title });
    return ok(parseCase(created), { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
