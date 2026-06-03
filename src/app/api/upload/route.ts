import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { validateSession, getMediaData, SESSION_COOKIE, MediaItem } from "@/lib/auth";

const MEDIA_PATH = path.join(process.cwd(), "data", "media.json");

export async function POST(request: NextRequest) {
  const sessionPassword = request.cookies.get(SESSION_COOKIE)?.value;
  if (!sessionPassword || !validateSession(sessionPassword).valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { title, client, type, url, tags } = body;

  if (!title || !client || !type || !url) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (type !== "image" && type !== "video") {
    return NextResponse.json({ error: "Type must be image or video" }, { status: 400 });
  }

  const existing = getMediaData();
  const newItem: MediaItem = {
    id: String(Date.now()),
    title,
    client,
    type,
    url,
    tags: Array.isArray(tags) ? tags : [],
  };

  fs.writeFileSync(MEDIA_PATH, JSON.stringify([...existing, newItem], null, 2));

  return NextResponse.json({ success: true, item: newItem });
}
