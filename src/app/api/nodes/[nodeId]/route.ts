import { ok, fail, handleError, logActivity, readJson } from "@/lib/api";
import { canWriteCase, getCurrentUserFromRequest } from "@/lib/current-user";
import { prisma } from "@/lib/db/prisma";
import { encodeNodeData, parseNode } from "@/lib/db/serde";
import { nodePatchSchema } from "@/lib/validators/caselink";
<<<<<<< HEAD
import { persistImageValue } from "@/lib/persist-image";
=======
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756

type Params = { params: Promise<{ nodeId: string }> };

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { nodeId } = await params;
    const user = await getCurrentUserFromRequest(request);
    if (!user) return fail("Authentication required.", 401);
<<<<<<< HEAD
    const existing = await prisma.caseNode.findUnique({ where: { id: nodeId }, select: { caseId: true, image: true } });
    if (!existing || !(await canWriteCase(existing.caseId, user.id))) return fail("You do not have permission to edit this node.", 403);
    const data = await readJson(request, nodePatchSchema);
    if (data.image !== undefined && data.image !== existing.image) {
      data.image = await persistImageValue(data.image);
    }
=======
    const existing = await prisma.caseNode.findUnique({ where: { id: nodeId }, select: { caseId: true } });
    if (!existing || !(await canWriteCase(existing.caseId, user.id))) return fail("You do not have permission to edit this node.", 403);
    const data = await readJson(request, nodePatchSchema);
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
    const node = await prisma.caseNode.update({ where: { id: nodeId }, data: encodeNodeData(data) });
    await logActivity(node.caseId, "updated", "node", node.id, data);
    return ok(parseNode(node));
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const { nodeId } = await params;
    const user = await getCurrentUserFromRequest(request);
    if (!user) return fail("Authentication required.", 401);
    const existing = await prisma.caseNode.findUnique({ where: { id: nodeId }, select: { caseId: true } });
    if (!existing || !(await canWriteCase(existing.caseId, user.id))) return fail("You do not have permission to delete this node.", 403);
    const node = await prisma.caseNode.delete({ where: { id: nodeId } });
    await logActivity(node.caseId, "deleted", "node", node.id, { title: node.title });
    return ok({ deleted: true });
  } catch (error) {
    return handleError(error);
  }
}
