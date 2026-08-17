export type UploadedFile = { name: string; url: string; size: number; type: string };

export async function uploadSelectedFiles(files: File[]) {
  if (!files.length) return [];
  const body = new FormData();
  files.forEach((file) => body.append("files", file));
  const response = await fetch("/api/uploads", { method: "POST", body });
  const result = await response.json().catch(() => null);
  if (!response.ok) throw new Error(result?.error || "File upload failed.");
  return (result?.files ?? []) as UploadedFile[];
}
