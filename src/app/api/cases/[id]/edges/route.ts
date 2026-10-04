import { ok, fail, handleError, logActivity, readJson } from "@/lib/api";
import { canReadCase, canWriteCase, getCurrentUserFromRequest } from "@/lib/current-user";
import { prisma } from "@/lib/db/prisma";
import { edgeSchema } from "@/lib/validators/caselink";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Params) {
  const { id } = await params;
  const user = await getCurrentUserFromRequest(request);
  if (!user) return fail("Authentication required.", 401);
  if (!(await canReadCase(id, user.id))) return fail("Case not found.", 404);
  const edges = await prisma.caseEdge.findMany({ where: { caseId: id }, orderBy: { updatedAt: "desc" } });
  return ok(edges);
}

export async function POST(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const user = await getCurrentUserFromRequest(request);
    if (!user) return fail("Authentication required.", 401);
    if (!(await canWriteCase(id, user.id))) return fail("You do not have permission to edit this board.", 403);
    const data = await readJson(request, edgeSchema);
    if (data.sourceNodeId === data.targetNodeId) return fail("A node cannot be connected to itself.", 422);
    const linkedNodes = await prisma.caseNode.count({
      where: { caseId: id, id: { in: [data.sourceNodeId, data.targetNodeId] } }
    });
    if (linkedNodes !== 2) return fail("Both nodes must belong to this case.", 422);
    const edge = await prisma.caseEdge.create({ data: { ...data, caseId: id } });
    await logActivity(id, "created", "edge", edge.id, { relationType: edge.relationType });
    return ok(edge, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
