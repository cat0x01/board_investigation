import { ok, safeSearchParam } from "@/lib/api";
import { getCurrentUserFromRequest, readableCaseWhere } from "@/lib/current-user";
import { prisma } from "@/lib/db/prisma";
<<<<<<< HEAD
import { parseCase, parseNode, parseNote } from "@/lib/db/serde";

export async function GET(request: Request) {
  const user = await getCurrentUserFromRequest(request);
  const empty = { cases: [], nodes: [], notes: [] };
  if (!user) return ok(empty, { status: 401 });
  const q = safeSearchParam(request.url, "q");
  if (q.length < 2) return ok(empty);
  const contains = { contains: q };
  const access = readableCaseWhere(user.id);
  const [cases, nodes, notes] = await Promise.all([
    prisma.case.findMany({ where: { AND: [access, { OR: [{ title: contains }, { caseId: contains }, { description: contains }, { assignedAnalyst: contains }] }] }, take: 10 }),
    prisma.caseNode.findMany({ where: { case: access, OR: [{ title: contains }, { subtitle: contains }, { description: contains }] }, take: 12 }),
    prisma.note.findMany({ where: { case: access, OR: [{ title: contains }, { body: contains }] }, take: 10 })
  ]);
  return ok({ cases: cases.map(parseCase), nodes: nodes.map(parseNode), notes: notes.map(parseNote) });
=======
import { parseCase, parseEvidence, parseNode, parseNote, parseTimeline } from "@/lib/db/serde";

export async function GET(request: Request) {
  const user = await getCurrentUserFromRequest(request);
  if (!user) return ok({ cases: [], nodes: [], evidence: [], notes: [], timelineEvents: [], edges: [] }, { status: 401 });
  const q = safeSearchParam(request.url, "q");
  if (q.length < 2) return ok({ cases: [], nodes: [], evidence: [], notes: [], timelineEvents: [], edges: [] });

  const contains = { contains: q };
  const caseAccess = readableCaseWhere(user.id);
  const [cases, nodes, evidence, notes, timelineEvents, edges] = await Promise.all([
    prisma.case.findMany({ where: { AND: [caseAccess, { OR: [{ title: contains }, { codename: contains }, { caseId: contains }, { description: contains }] }] }, take: 12 }),
    prisma.caseNode.findMany({ where: { case: caseAccess, OR: [{ title: contains }, { subtitle: contains }, { description: contains }, { source: contains }] }, take: 18 }),
    prisma.evidence.findMany({ where: { case: caseAccess, OR: [{ title: contains }, { source: contains }, { fileName: contains }] }, take: 12 }),
    prisma.note.findMany({ where: { case: caseAccess, OR: [{ title: contains }, { body: contains }] }, take: 12 }),
    prisma.timelineEvent.findMany({ where: { case: caseAccess, OR: [{ title: contains }, { eventType: contains }, { description: contains }] }, take: 12 }),
    prisma.caseEdge.findMany({ where: { case: caseAccess, OR: [{ relationType: contains }, { shortDescription: contains }, { source: contains }] }, take: 12 })
  ]);

  return ok({
    cases: cases.map(parseCase),
    nodes: nodes.map(parseNode),
    evidence: evidence.map(parseEvidence),
    notes: notes.map(parseNote),
    timelineEvents: timelineEvents.map(parseTimeline),
    edges
  });
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
}
