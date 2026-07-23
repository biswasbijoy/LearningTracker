import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { readFile } from "fs/promises";
import path from "path";

export async function GET(
  _request: Request,
  context: RouteContext<"/api/files/[...key]">
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { key } = await context.params;
    const storageKey = Array.isArray(key) ? key.join("/") : key;

    const evidence = await prisma.evidenceItem.findFirst({
      where: { storageKey, ownerId: session.user.id },
    });

    if (!evidence) {
      return new Response("Not found", { status: 404 });
    }

    const filePath = path.join(process.cwd(), "uploads", "evidence", storageKey);

    let buffer: Buffer;
    try {
      buffer = await readFile(filePath);
    } catch {
      return new Response("File not found on disk", { status: 404 });
    }

    const url = new URL(_request.url);
    const download = url.searchParams.get("download") === "true";

    const uint8 = new Uint8Array(buffer);
    return new Response(uint8, {
      headers: {
        "Content-Type": download
          ? "application/octet-stream"
          : (evidence.mimeType ?? "application/octet-stream"),
        "Content-Disposition": download
          ? `attachment; filename="${encodeURIComponent(evidence.fileName ?? "download")}"`
          : "inline",
        "Content-Length": String(uint8.length),
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (error) {
    console.error("File serve error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
