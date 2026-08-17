import { ok, fail, handleError, logActivity, readJson } from "@/lib/api";
import { getCurrentUserFromRequest, publicUserSelect, readableCaseWhere } from "@/lib/current-user";
import { prisma } from "@/lib/db/prisma";
import { encodeCaseData, parseCase } from "@/lib/db/serde";
import { caseSchema } from "@/lib/validators/caselink";
<<<<<<< HEAD
import { persistImageValue } from "@/lib/persist-image";
=======
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756

export async function GET(request: Request) {
  const user = await getCurrentUserFromRequest(request);
  if (!user) return fail("Authentication required.", 401);
  const cases = await prisma.case.findMany({
    where: readableCaseWhere(user.id),
    orderBy: { updatedAt: "desc" },
    include: { user: { select: publicUserSelect }, shares: { include: { user: { select: publicUserSelect } } }, _count: { select: { nodes: true, evidence: true, notes: true, timelineEvents: true } } }
  });
  return ok(cases.map((item) => ({ ...parseCase(item), _count: item._count })));
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUserFromRequest(request);
    if (!user) return fail("Authentication required.", 401);
    const data = await readJson(request, caseSchema);
<<<<<<< HEAD
    data.image = await persistImageValue(data.image);
=======
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
    const existing = await prisma.case.findUnique({ where: { caseId: data.caseId } });
    if (existing) return fail("Case ID is already in use.", 409);
    const created = await prisma.case.create({ data: { ...encodeCaseData(data), userId: user.id, assignedAnalyst: data.assignedAnalyst || user.name } });
    await logActivity(created.id, "created", "case", created.id, { title: created.title });
    return ok(parseCase(created), { status: 201 });
  } catch (error) {
    if (typeof error === "object" && error && "code" in error && error.code === "P2002") return fail("Case ID is already in use.", 409);
    return handleError(error);
  }
}
