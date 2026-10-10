const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "https://portfolio.waridi.org").replace(/\/$/, "");
const imageContentTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function GET(_request: Request, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const [directory, filename] = path;

  if (
    path.length !== 2 ||
    !["blog", "projects"].includes(directory) ||
    !/^[\w.-]+\.(?:jpe?g|png|webp)$/i.test(filename)
  ) {
    return new Response("Not found", { status: 404 });
  }

  const encodedPath = path.map((segment) => encodeURIComponent(segment)).join("/");
  const upstream = await fetch(`${API_BASE_URL}/uploads/${encodedPath}`, { signal: AbortSignal.timeout(5000) });
  if (!upstream.ok || !upstream.body) return new Response("Not found", { status: 404 });

  const contentType = upstream.headers.get("content-type")?.split(";")[0].trim().toLowerCase();
  if (!contentType || !imageContentTypes.has(contentType)) return new Response("Unsupported image type", { status: 415 });

  return new Response(upstream.body, {
    headers: {
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
      "Content-Type": contentType,
      "X-Content-Type-Options": "nosniff",
    },
  });
}