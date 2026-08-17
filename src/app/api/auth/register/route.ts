import { NextResponse } from "next/server";
import { z } from "zod";
import { fail, handleError, readJson } from "@/lib/api";
import { CURRENT_USER_COOKIE, publicUserSelect } from "@/lib/current-user";
import { prisma } from "@/lib/db/prisma";
import { hashPassword } from "@/lib/password";

const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(160).transform((value) => value.toLowerCase()),
  password: z.string().min(8).max(128),
  role: z.string().trim().min(2).max(80).default("Analyst")
});

export async function POST(request: Request) {
  try {
    const data = await readJson(request, registerSchema);
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing?.passwordHash) return fail("Email is already registered.", 409);

    const user = existing
      ? await prisma.user.update({
          where: { id: existing.id },
          data: { name: data.name, role: data.role, passwordHash: hashPassword(data.password) },
          select: publicUserSelect
        })
      : await prisma.user.create({
          data: { name: data.name, email: data.email, role: data.role, passwordHash: hashPassword(data.password) },
          select: publicUserSelect
        });

    const response = NextResponse.json(user, { status: 201 });
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
