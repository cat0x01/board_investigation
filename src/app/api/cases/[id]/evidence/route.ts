import { ok, fail, handleError, logActivity, readJson } from "@/lib/api";
import { canReadCase, canWriteCase, getCurrentUserFromRequest } from "@/lib/current-user";
import { prisma } from "@/lib/db/prisma";
import { encodeEvidenceData, parseEvidence } from "@/lib/db/serde";
import { saveEvidenceFile } from "@/lib/upload";
import { evidenceSchema } from "@/lib/validators/caselink";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Params) {
  const { id } = await params;
  const user = await getCurrentUserFromRequest(request);
  if (!user) return fail("Authentication required.", 401);
  if (!(await canReadCase(id, user.id))) return fail("Case not found.", 404);
  const evidence = await prisma.evidence.findMany({ where: { caseId: id }, orderBy: { updatedAt: "desc" } });
  return ok(evidence.map(parseEvidence));
}

export async function POST(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const user = await getCurrentUserFromRequest(request);
    if (!user) return fail("Authentication required.", 401);
    if (!(await canWriteCase(id, user.id))) return fail("You do not have permission to edit this evidence.", 403);
    let payload: unknown;
    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      const file = form.get("file");
      const uploaded = file instanceof File && file.size > 0 ? await saveEvidenceFile(file) : {};
      payload = {
        title: form.get("title") || (file instanceof File ? file.name : "Untitled evidence"),
        fileType: form.get("fileType") || (file instanceof File ? file.type || "Document" : "Document"),
        source: form.get("source") || "",
        collectedBy: form.get("collectedBy") || "",
        collectionDate: form.get("collectionDate") || undefined,
        md5: form.get("md5") || "",
        sha1: form.get("sha1") || "",
        sha256: form.get("sha256") || "",
        chainOfCustodyNotes: form.get("chainOfCustodyNotes") || "",
        relatedNodeIds: form.get("relatedNodeIds") || "",
        ...uploaded
      };
    } else {
      return POST_JSON(request, id);
    }

    const data = evidenceSchema.parse(payload);
    const evidence = await prisma.evidence.create({ data: { ...encodeEvidenceData(data), caseId: id } });
    await logActivity(id, "created", "evidence", evidence.id, { title: evidence.title });
    return ok(parseEvidence(evidence), { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}

async function POST_JSON(request: Request, caseId: string) {
  const data = await readJson(request, evidenceSchema);
  const evidence = await prisma.evidence.create({ data: { ...encodeEvidenceData(data), caseId } });
  await logActivity(caseId, "created", "evidence", evidence.id, { title: evidence.title });
  return ok(parseEvidence(evidence), { status: 201 });
}
