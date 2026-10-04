import { ok, fail, handleError, logActivity, readJson } from "@/lib/api";
import { canOwnCase, canReadCase, canWriteCase, getCurrentUserFromRequest } from "@/lib/current-user";
import { prisma } from "@/lib/db/prisma";
import { encodeCaseData, parseCase, parseNode, parseNote } from "@/lib/db/serde";
import { casePatchSchema } from "@/lib/validators/caselink";
import { persistImageValue } from "@/lib/persist-image";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Params) {
  const { id } = await params;
  const user = await getCurrentUserFromRequest(request);
  if (!user) return fail("Authentication required.", 401);
  if (!(await canReadCase(id, user.id))) return fail("Case not found.", 404);
  const record = await prisma.case.findUnique({
    where: { id },
    include: {
      nodes: true,
      edges: true,
      notes: { orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }] },
    }
  });
  if (!record) return fail("Case not found.", 404);
  return ok({
    ...parseCase(record),
    nodes: record.nodes.map(parseNode),
    notes: record.notes.map(parseNote)
  });
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const user = await getCurrentUserFromRequest(request);
    if (!user) return fail("Authentication required.", 401);
    if (!(await canWriteCase(id, user.id))) return fail("You do not have permission to update this case.", 403);
    const data = await readJson(request, casePatchSchema);
    if (data.image !== undefined) data.image = await persistImageValue(data.image);
    const updated = await prisma.case.update({ where: { id }, data: encodeCaseData(data) });
    await logActivity(id, "updated", "case", id, data);
    return ok(parseCase(updated));
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const user = await getCurrentUserFromRequest(request);
    if (!user) return fail("Authentication required.", 401);
    if (!(await canOwnCase(id, user.id))) return fail("Only the case owner can delete this case.", 403);
    await prisma.case.delete({ where: { id } });
    return ok({ deleted: true });
  } catch (error) {
    return handleError(error);
  }
}
