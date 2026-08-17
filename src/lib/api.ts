import { NextResponse } from "next/server";
import { ZodError, ZodSchema } from "zod";
import { prisma } from "@/lib/db/prisma";
import { encodeActivityDetails } from "@/lib/db/serde";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function fail(message: string, status = 400, details?: unknown) {
  return NextResponse.json({ error: message, details }, { status });
}

export async function readJson<T>(request: Request, schema: ZodSchema<T>): Promise<T> {
  const body = await request.json().catch(() => ({}));
  return schema.parse(body);
}

export function handleError(error: unknown) {
  if (error instanceof ZodError) {
    return fail("Validation failed", 422, error.flatten());
  }
  if (error instanceof Error) {
    return fail(error.message || "Request failed", 400);
  }
  return fail("Request failed", 400);
}

export async function logActivity(caseId: string | null, action: string, entity: string, entityId = "", details: object = {}) {
<<<<<<< HEAD
  try {
    const encoded = encodeActivityDetails(details);
    const safeDetails = encoded.length <= 10_000
      ? encoded
      : encodeActivityDetails({ omitted: true, reason: "Activity details exceeded 10 KB", fields: Object.keys(details) });
    await prisma.activityLog.create({
      data: { caseId, action, entity, entityId, details: safeDetails }
    });
  } catch {
    // Audit logging must never turn an already-successful user mutation into a failed request.
  }
=======
  await prisma.activityLog.create({
    data: {
      caseId,
      action,
      entity,
      entityId,
      details: encodeActivityDetails(details)
    }
  });
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
}

export function safeSearchParam(url: string, name: string) {
  return new URL(url).searchParams.get(name)?.trim() ?? "";
}
