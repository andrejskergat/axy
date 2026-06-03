import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { validateSession, getMediaData, SESSION_COOKIE } from "@/lib/auth";

const MEDIA_PATH = path.join(process.cwd(), "data", "media.json");

export async function DELETE(request: NextRequest) {
  const sessionPassword = request.cookies.get(SESSION_COOKIE)?.value;
  if (!sessionPassword || !validateSession(sessionPassword).valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const existing = getMediaData();
  const item = existing.find((i) => i.id === id);
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = existing.filter((i) => i.id !== id);
  fs.writeFileSync(MEDIA_PATH, JSON.stringify(updated, null, 2));

  return NextResponse.json({ success: true });
}
