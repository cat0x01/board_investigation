const MAX_REMOTE_IMAGE_BYTES = 25 * 1024 * 1024;

/**
 * Copies a remote image into the SQLite record as a data URL. Existing data
 * URLs and local paths are already persistent and are returned unchanged.
 * If a remote host rejects the download, the original URL is preserved.
 */
export async function persistImageValue(value: string) {
  const image = value.trim();
  if (!image || image.startsWith("data:") || image.startsWith("/")) return image;

  let url: URL;
  try {
    url = new URL(image);
  } catch {
    return image;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return image;

  try {
    const response = await fetch(url, {
      headers: { "user-agent": "Mozilla/5.0 (compatible; CAT0X01-ImageArchiver/1.0)" },
      signal: AbortSignal.timeout(15_000),
      cache: "no-store"
    });
    if (!response.ok) return image;
    const contentType = response.headers.get("content-type")?.split(";")[0]?.trim().toLowerCase() ?? "";
    if (!contentType.startsWith("image/")) return image;
    const declaredLength = Number(response.headers.get("content-length") || 0);
    if (declaredLength > MAX_REMOTE_IMAGE_BYTES) return image;
    const bytes = Buffer.from(await response.arrayBuffer());
    if (!bytes.length || bytes.length > MAX_REMOTE_IMAGE_BYTES) return image;
    return `data:${contentType};base64,${bytes.toString("base64")}`;
  } catch {
    return image;
  }
}
