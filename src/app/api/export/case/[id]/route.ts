import { fail, ok } from "@/lib/api";
import { canReadCase, getCurrentUserFromRequest } from "@/lib/current-user";
import { prisma } from "@/lib/db/prisma";
import { parseCase, parseEvidence, parseNode, parseNote, parseTimeline } from "@/lib/db/serde";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  const { id } = await params;
  const user = await getCurrentUserFromRequest(request);
  if (!user) return fail("Authentication required.", 401);
  if (!(await canReadCase(id, user.id))) return fail("Case not found.", 404);
  const record = await prisma.case.findUnique({
    where: { id },
    include: { nodes: true, edges: true, evidence: true, timelineEvents: true, notes: true, activityLogs: true }
  });
  if (!record) return fail("Case not found.", 404);
  return ok({
    exportedAt: new Date().toISOString(),
    schema: "caselink.case.v1",
    ...parseCase(record),
    nodes: record.nodes.map(parseNode),
    evidence: record.evidence.map(parseEvidence),
    timelineEvents: record.timelineEvents.map(parseTimeline),
    notes: record.notes.map(parseNote)
  });
}
