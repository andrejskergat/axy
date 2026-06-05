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

async function getDriveMimeType(url: string): Promise<string | null> {
  try {
    const match = url.match(/\/file\/d\/([^/]+)/);
    if (!match) return null;
    const fileId = match[1];
    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?fields=mimeType&key=${process.env.GOOGLE_API_KEY}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.mimeType || null;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  const sessionPassword = request.cookies.get(SESSION_COOKIE)?.value;
  if (!sessionPassword || !validateSession(sessionPassword).valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.GITHUB_TOKEN) {
    return NextResponse.json({ error: "GITHUB_TOKEN not configured" }, { status: 500 });
  }

  const body = await request.json();
  const { title, type, url, tags, client } = body;

  if (!title || !type || !url) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (type !== "image" && type !== "video") {
    return NextResponse.json({ error: "Type must be image or video" }, { status: 400 });
  }

  // Detect mime type for videos to handle MOV vs MP4
  let mimeType: string | undefined;
  if (type === "video") {
    mimeType = await getDriveMimeType(url) ?? undefined;
  }

  const existing = getMediaData();
  const newItem: MediaItem = {
    id: String(Date.now()),
    title,
    client: client || "",
    type,
    url,
    ...(mimeType ? { mimeType } : {}),
    tags: Array.isArray(tags) ? tags : [],
  };

  await writeMediaJson([...existing, newItem]);

  return NextResponse.json({ success: true, item: newItem });
}
