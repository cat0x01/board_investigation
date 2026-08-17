import { NextResponse } from "next/server";
import { z } from "zod";
import { fail, handleError, readJson } from "@/lib/api";
import { CURRENT_USER_COOKIE, publicUserSelect } from "@/lib/current-user";
import { prisma } from "@/lib/db/prisma";
import { verifyPassword } from "@/lib/password";

const loginSchema = z.object({
  email: z.string().trim().email().transform((value) => value.toLowerCase()),
  password: z.string().min(1)
});

export async function POST(request: Request) {
  try {
    const data = await readJson(request, loginSchema);
    const record = await prisma.user.findUnique({ where: { email: data.email } });
    if (!record?.passwordHash || !verifyPassword(data.password, record.passwordHash)) return fail("Invalid email or password.", 401);

    const user = await prisma.user.findUniqueOrThrow({ where: { id: record.id }, select: publicUserSelect });
    const response = NextResponse.json(user);
    response.cookies.set(CURRENT_USER_COOKIE, user.id, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30
    });
    return response;
  } catch (error) {
    return handleError(error);
  }
}
