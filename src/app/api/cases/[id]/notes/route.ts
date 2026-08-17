import { ok, fail, handleError, logActivity, readJson } from "@/lib/api";
import { canReadCase, canWriteCase, getCurrentUserFromRequest } from "@/lib/current-user";
import { prisma } from "@/lib/db/prisma";
import { encodeNoteData, parseNote } from "@/lib/db/serde";
import { noteSchema } from "@/lib/validators/caselink";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Params) {
  const { id } = await params;
  const user = await getCurrentUserFromRequest(request);
  if (!user) return fail("Authentication required.", 401);
  if (!(await canReadCase(id, user.id))) return fail("Case not found.", 404);
  const notes = await prisma.note.findMany({ where: { caseId: id }, orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }] });
  return ok(notes.map(parseNote));
}

export async function POST(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const user = await getCurrentUserFromRequest(request);
    if (!user) return fail("Authentication required.", 401);
    if (!(await canWriteCase(id, user.id))) return fail("You do not have permission to edit these notes.", 403);
    const data = await readJson(request, noteSchema);
    const note = await prisma.note.create({ data: { ...encodeNoteData(data), caseId: id } });
    await logActivity(id, "created", "note", note.id, { title: note.title });
    return ok(parseNote(note), { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
