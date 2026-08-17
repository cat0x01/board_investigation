import { ok, fail, handleError, logActivity, readJson } from "@/lib/api";
import { canReadCase, canWriteCase, getCurrentUserFromRequest } from "@/lib/current-user";
import { prisma } from "@/lib/db/prisma";
import { encodeNodeData, parseNode } from "@/lib/db/serde";
import { nodeSchema } from "@/lib/validators/caselink";
<<<<<<< HEAD
import { persistImageValue } from "@/lib/persist-image";
=======
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756

type Params = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Params) {
  const { id } = await params;
  const user = await getCurrentUserFromRequest(request);
  if (!user) return fail("Authentication required.", 401);
  if (!(await canReadCase(id, user.id))) return fail("Case not found.", 404);
  const nodes = await prisma.caseNode.findMany({ where: { caseId: id }, orderBy: { updatedAt: "desc" } });
  return ok(nodes.map(parseNode));
}

export async function POST(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const user = await getCurrentUserFromRequest(request);
    if (!user) return fail("Authentication required.", 401);
    if (!(await canWriteCase(id, user.id))) return fail("You do not have permission to edit this board.", 403);
    const data = await readJson(request, nodeSchema);
<<<<<<< HEAD
    data.image = await persistImageValue(data.image);
=======
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
    const node = await prisma.caseNode.create({ data: { ...encodeNodeData(data), caseId: id } });
    await logActivity(id, "created", "node", node.id, { title: node.title });
    return ok(parseNode(node), { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
