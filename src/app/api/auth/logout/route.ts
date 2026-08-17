import { NextResponse } from "next/server";
import { CURRENT_USER_COOKIE } from "@/lib/current-user";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(CURRENT_USER_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0
  });
  return response;
}
