import { mkdir, writeFile } from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const SAFE_EXTENSIONS = new Set([".pdf", ".png", ".jpg", ".jpeg", ".gif", ".webp", ".txt", ".csv", ".json", ".md", ".doc", ".docx"]);

export async function saveEvidenceFile(file: File) {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("File exceeds the 10 MB upload limit.");
  }

  const originalName = path.basename(file.name).replace(/[^a-zA-Z0-9._-]/g, "_");
  const ext = path.extname(originalName).toLowerCase();
  if (!SAFE_EXTENSIONS.has(ext)) {
    throw new Error("File type is not allowed.");
  }

  await mkdir(UPLOAD_DIR, { recursive: true });
  const storedName = `${Date.now()}-${crypto.randomUUID()}-${originalName}`;
  const target = path.join(UPLOAD_DIR, storedName);
  const relativePath = path.join("uploads", storedName);
  if (!target.startsWith(UPLOAD_DIR)) {
    throw new Error("Invalid upload path.");
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(target, bytes, { mode: 0o600 });

  return {
    fileName: originalName,
    filePath: relativePath,
    fileSize: file.size
  };
}
