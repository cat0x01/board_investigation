import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";

export const CURRENT_USER_COOKIE = "caselink_session";

export const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true
} as const;

export async function getCurrentUser(userId?: string | null) {
  if (!userId) return null;
  return prisma.user.findFirst({ where: { id: userId, passwordHash: { not: "" } }, select: publicUserSelect });
}

export async function getCurrentUserFromCookies() {
  const store = await cookies();
  const user = await getCurrentUser(store.get(CURRENT_USER_COOKIE)?.value);
  if (!user) redirect("/login");
  return user;
}

export async function getOptionalCurrentUserFromCookies() {
  const store = await cookies();
  return getCurrentUser(store.get(CURRENT_USER_COOKIE)?.value);
}

export async function getCurrentUserFromRequest(request: Request) {
  const cookie = request.headers.get("cookie") ?? "";
  const match = cookie.match(new RegExp(`(?:^|; )${CURRENT_USER_COOKIE}=([^;]+)`));
  return getCurrentUser(match ? decodeURIComponent(match[1]) : null);
}

export function readableCaseWhere(userId: string) {
  return {
    OR: [
      { userId },
      { shares: { some: { userId } } }
    ]
  };
}

export function writableCaseWhere(userId: string) {
  return {
    OR: [
      { userId },
      { shares: { some: { userId, access: "Editor" } } }
    ]
  };
}

export async function canReadCase(caseId: string, userId: string) {
  return Boolean(await prisma.case.findFirst({ where: { id: caseId, ...readableCaseWhere(userId) }, select: { id: true } }));
}

export async function canWriteCase(caseId: string, userId: string) {
  return Boolean(await prisma.case.findFirst({ where: { id: caseId, ...writableCaseWhere(userId) }, select: { id: true } }));
}

export async function canOwnCase(caseId: string, userId: string) {
  return Boolean(await prisma.case.findFirst({ where: { id: caseId, userId }, select: { id: true } }));
}
