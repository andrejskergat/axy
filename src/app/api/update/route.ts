import { NextRequest, NextResponse } from "next/server";
import { validateSession, getMediaData, SESSION_COOKIE, MediaItem } from "@/lib/auth";

const REPO = "andrejskergat/axy";
const FILE_PATH = "data/media.json";
const BRANCH = "claude/great-hypatia-XUQBd";

async function getFileSha(): Promise<string> {
  const token = process.env.GITHUB_TOKEN;
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`,
    { headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" } }
  );
  const data = await res.json();
  return data.sha;
}

async function writeMediaJson(items: MediaItem[]): Promise<void> {
  const token = process.env.GITHUB_TOKEN;
  const sha = await getFileSha();
  const content = Buffer.from(JSON.stringify(items, null, 2)).toString("base64");
  await fetch(
    `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`,
    {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Update media.json via dashboard", content, sha, branch: BRANCH }),
    }
  );
}

export async function PATCH(request: NextRequest) {
  const sessionPassword = request.cookies.get(SESSION_COOKIE)?.value;
  if (!sessionPassword || !validateSession(sessionPassword).valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.GITHUB_TOKEN) {
    return NextResponse.json({ error: "GITHUB_TOKEN not configured" }, { status: 500 });
  }

  const { id, title } = await request.json();
  if (!id || !title?.trim()) {
    return NextResponse.json({ error: "Missing id or title" }, { status: 400 });
  }

  const existing = getMediaData();
  const updated = existing.map((item) => item.id === id ? { ...item, title: title.trim() } : item);
  await writeMediaJson(updated);

  return NextResponse.json({ success: true });
}
