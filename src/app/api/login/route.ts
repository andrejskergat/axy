import { NextRequest, NextResponse } from "next/server";
import { validatePassword, SESSION_COOKIE } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body as { password: string };

    if (!password || typeof password !== "string") {
      return NextResponse.json({ error: "Password is required." }, { status: 400 });
    }

    const result = validatePassword(password);

    if (!result.valid) {
      return NextResponse.json({ error: result.reason }, { status: 401 });
    }

    const response = NextResponse.json({ success: true, role: result.role });
    response.cookies.set(SESSION_COOKIE, `${result.role}:${password}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 72,
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
