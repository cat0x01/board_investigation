import { ok, safeSearchParam } from "@/lib/api";
import { getCurrentUserFromRequest, readableCaseWhere } from "@/lib/current-user";
import { prisma } from "@/lib/db/prisma";
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
}
