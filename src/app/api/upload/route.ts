import { auth } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return Response.json({ error: "File too large (max 50MB)" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name) || "";
    const storageKey = `${session.user.id}/${randomUUID()}${ext}`;
    const uploadDir = path.join(process.cwd(), "uploads", "evidence", session.user.id);

    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, path.basename(storageKey)), buffer);

    return Response.json({
      storageKey,
      fileName: file.name,
      mimeType: file.type || "application/octet-stream",
      fileSize: file.size,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return Response.json({ error: "Upload failed" }, { status: 500 });
  }
}
