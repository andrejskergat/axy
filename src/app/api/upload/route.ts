import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { validateSession, getMediaData, SESSION_COOKIE, MediaItem } from "@/lib/auth";

const MEDIA_DIR = path.join(process.cwd(), "public", "media");
const MEDIA_PATH = path.join(process.cwd(), "data", "media.json");

export async function POST(request: NextRequest) {
  const sessionPassword = request.cookies.get(SESSION_COOKIE)?.value;
  if (!sessionPassword || !validateSession(sessionPassword).valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const title = formData.get("title") as string;
  const client = formData.get("client") as string;
  const tagsRaw = formData.get("tags") as string;

  if (!file || !title || !client) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "video/mp4", "video/quicktime", "video/webm"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const destPath = path.join(MEDIA_DIR, safeName);

  const buffer = Buffer.from(await file.arrayBuffer());
  fs.mkdirSync(MEDIA_DIR, { recursive: true });
  fs.writeFileSync(destPath, buffer);

  const isVideo = file.type.startsWith("video/");
  const tags = tagsRaw ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean) : [];

  const existing = getMediaData();
  const newId = String(Date.now());
  const newItem: MediaItem = {
    id: newId,
    title,
    client,
    type: isVideo ? "video" : "image",
    filename: safeName,
    tags,
  };

  fs.writeFileSync(MEDIA_PATH, JSON.stringify([...existing, newItem], null, 2));

  return NextResponse.json({ success: true, item: newItem });
}
