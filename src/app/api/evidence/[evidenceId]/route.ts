import { ok, fail, handleError, logActivity, readJson } from "@/lib/api";
import { canReadCase, canWriteCase, getCurrentUserFromRequest } from "@/lib/current-user";
import { prisma } from "@/lib/db/prisma";
import { encodeEvidenceData, parseEvidence } from "@/lib/db/serde";
import { evidencePatchSchema } from "@/lib/validators/caselink";
import { readFile } from "fs/promises";
import path from "path";

type Params = { params: Promise<{ evidenceId: string }> };

export async function GET(request: Request, { params }: Params) {
  try {
    const { evidenceId } = await params;
    const user = await getCurrentUserFromRequest(request);
    if (!user) return new Response("Authentication required.", { status: 401 });
    const evidence = await prisma.evidence.findUnique({ where: { id: evidenceId } });
    if (!evidence || !(await canReadCase(evidence.caseId, user.id))) return new Response("File not found.", { status: 404 });
    if (!evidence?.filePath) return new Response("File not found.", { status: 404 });
    const uploadsRoot = path.join(process.cwd(), "uploads");
    const target = path.join(uploadsRoot, path.basename(evidence.filePath));
    if (!target.startsWith(uploadsRoot)) return new Response("Invalid file path.", { status: 400 });
    const file = await readFile(target);
    return new Response(file, {
      headers: {
        "content-type": evidence.fileType || "application/octet-stream",
        "content-disposition": `attachment; filename="${encodeURIComponent(evidence.fileName || evidence.title)}"`
      }
    });
  } catch {
    return new Response("File not available.", { status: 404 });
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { evidenceId } = await params;
    const user = await getCurrentUserFromRequest(request);
    if (!user) return fail("Authentication required.", 401);
    const existing = await prisma.evidence.findUnique({ where: { id: evidenceId }, select: { caseId: true } });
    if (!existing || !(await canWriteCase(existing.caseId, user.id))) return fail("You do not have permission to edit this evidence.", 403);
    const data = await readJson(request, evidencePatchSchema);
    const evidence = await prisma.evidence.update({ where: { id: evidenceId }, data: encodeEvidenceData(data) });
    await logActivity(evidence.caseId, "updated", "evidence", evidence.id, data);
    return ok(parseEvidence(evidence));
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const { evidenceId } = await params;
    const user = await getCurrentUserFromRequest(request);
    if (!user) return fail("Authentication required.", 401);
    const existing = await prisma.evidence.findUnique({ where: { id: evidenceId }, select: { caseId: true } });
    if (!existing || !(await canWriteCase(existing.caseId, user.id))) return fail("You do not have permission to delete this evidence.", 403);
    const evidence = await prisma.evidence.delete({ where: { id: evidenceId } });
    await logActivity(evidence.caseId, "deleted", "evidence", evidence.id, { title: evidence.title });
    return ok({ deleted: true });
  } catch (error) {
    return handleError(error);
  }
}
