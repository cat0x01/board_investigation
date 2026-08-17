import { fail, ok } from "@/lib/api";
import { getCurrentUserFromRequest, publicUserSelect } from "@/lib/current-user";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: Request) {
  const user = await getCurrentUserFromRequest(request);
  if (!user) return fail("Authentication required.", 401);
  const users = await prisma.user.findMany({ where: { passwordHash: { not: "" } }, select: publicUserSelect, orderBy: { name: "asc" } });
  return ok(users);
}
