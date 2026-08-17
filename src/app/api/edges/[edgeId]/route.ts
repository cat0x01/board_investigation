import { ok, fail, handleError, logActivity, readJson } from "@/lib/api";
import { canWriteCase, getCurrentUserFromRequest } from "@/lib/current-user";
import { prisma } from "@/lib/db/prisma";
import { edgePatchSchema } from "@/lib/validators/caselink";

type Params = { params: Promise<{ edgeId: string }> };

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { edgeId } = await params;
    const user = await getCurrentUserFromRequest(request);
    if (!user) return fail("Authentication required.", 401);
    const existing = await prisma.caseEdge.findUnique({ where: { id: edgeId }, select: { caseId: true } });
    if (!existing || !(await canWriteCase(existing.caseId, user.id))) return fail("You do not have permission to edit this edge.", 403);
    const data = await readJson(request, edgePatchSchema);
    const edge = await prisma.caseEdge.update({ where: { id: edgeId }, data });
    await logActivity(edge.caseId, "updated", "edge", edge.id, data);
    return ok(edge);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const { edgeId } = await params;
    const user = await getCurrentUserFromRequest(request);
    if (!user) return fail("Authentication required.", 401);
    const existing = await prisma.caseEdge.findUnique({ where: { id: edgeId }, select: { caseId: true } });
    if (!existing || !(await canWriteCase(existing.caseId, user.id))) return fail("You do not have permission to delete this edge.", 403);
    const edge = await prisma.caseEdge.delete({ where: { id: edgeId } });
    await logActivity(edge.caseId, "deleted", "edge", edge.id, { relationType: edge.relationType });
    return ok({ deleted: true });
  } catch (error) {
    return handleError(error);
  }
}
