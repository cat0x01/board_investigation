import { fail, ok } from "@/lib/api";
import { getCurrentUserFromRequest } from "@/lib/current-user";

export async function GET(request: Request) {
  const user = await getCurrentUserFromRequest(request);
  if (!user) return fail("Authentication required.", 401);
  return ok(user);
}
