import { NextRequest, NextResponse } from "next/server";
import { validateSession, getMediaData, SESSION_COOKIE } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const sessionPassword = request.cookies.get(SESSION_COOKIE)?.value;

  if (!sessionPassword) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const result = validateSession(sessionPassword);
  if (!result.valid) {
    return NextResponse.json({ error: result.reason }, { status: 401 });
  }

  const media = getMediaData();
  return NextResponse.json(media);
}
