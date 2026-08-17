import { z } from "zod";
import { fail, handleError, logActivity, ok, readJson } from "@/lib/api";
import { canOwnCase, getCurrentUserFromRequest, publicUserSelect } from "@/lib/current-user";
import { prisma } from "@/lib/db/prisma";

type Params = { params: Promise<{ id: string }> };

const shareSchema = z.object({
  userId: z.string().min(1),
  access: z.enum(["Viewer", "Editor"]).default("Viewer")
});

export async function GET(request: Request, { params }: Params) {
  const { id } = await params;
  const user = await getCurrentUserFromRequest(request);
  if (!user) return fail("Authentication required.", 401);
  if (!(await canOwnCase(id, user.id))) return fail("Only the case owner can manage sharing.", 403);
  const shares = await prisma.caseShare.findMany({ where: { caseId: id }, include: { user: { select: publicUserSelect } }, orderBy: { createdAt: "desc" } });
  return ok(shares);
}

export async function POST(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const user = await getCurrentUserFromRequest(request);
    if (!user) return fail("Authentication required.", 401);
    if (!(await canOwnCase(id, user.id))) return fail("Only the case owner can share this case.", 403);

    const data = await readJson(request, shareSchema);
    if (data.userId === user.id) return fail("The owner already has access.", 400);

    const target = await prisma.user.findUnique({ where: { id: data.userId } });
    if (!target) return fail("User not found.", 404);

    const share = await prisma.caseShare.upsert({
      where: { caseId_userId: { caseId: id, userId: data.userId } },
      update: { access: data.access },
      create: { caseId: id, userId: data.userId, access: data.access },
      include: { user: { select: publicUserSelect } }
    });
    await logActivity(id, "shared", "case", id, { user: target.name, access: data.access });
    return ok(share, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const user = await getCurrentUserFromRequest(request);
    if (!user) return fail("Authentication required.", 401);
    if (!(await canOwnCase(id, user.id))) return fail("Only the case owner can update sharing.", 403);

    const userId = new URL(request.url).searchParams.get("userId");
    if (!userId) return fail("Missing userId.", 400);
    await prisma.caseShare.delete({ where: { caseId_userId: { caseId: id, userId } } });
    await logActivity(id, "unshared", "case", id, { userId });
    return ok({ deleted: true });
  } catch (error) {
    return handleError(error);
  }
}
