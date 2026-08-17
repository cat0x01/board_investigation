import { ok, fail, handleError, logActivity, readJson } from "@/lib/api";
import { canReadCase, canWriteCase, getCurrentUserFromRequest } from "@/lib/current-user";
import { prisma } from "@/lib/db/prisma";
import { encodeTimelineData, parseTimeline } from "@/lib/db/serde";
import { timelineSchema } from "@/lib/validators/caselink";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Params) {
  const { id } = await params;
  const user = await getCurrentUserFromRequest(request);
  if (!user) return fail("Authentication required.", 401);
  if (!(await canReadCase(id, user.id))) return fail("Case not found.", 404);
  const events = await prisma.timelineEvent.findMany({ where: { caseId: id }, orderBy: { occurredAt: "desc" } });
  return ok(events.map(parseTimeline));
}

export async function POST(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const user = await getCurrentUserFromRequest(request);
    if (!user) return fail("Authentication required.", 401);
    if (!(await canWriteCase(id, user.id))) return fail("You do not have permission to edit this timeline.", 403);
    const data = await readJson(request, timelineSchema);
    const event = await prisma.timelineEvent.create({ data: { ...encodeTimelineData(data), caseId: id } });
    await logActivity(id, "created", "timeline-event", event.id, { title: event.title });
    return ok(parseTimeline(event), { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
