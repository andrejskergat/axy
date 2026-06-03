import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow login page and API login route through
  if (pathname === "/login" || pathname === "/api/login" || pathname === "/api/logout") {
    return NextResponse.next();
  }

  // Allow static files and Next internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/public")
  ) {
    return NextResponse.next();
  }

  const sessionPassword = request.cookies.get(SESSION_COOKIE)?.value;

  if (!sessionPassword) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Note: We can't read files in middleware (edge runtime), so we pass the
  // session check to the page/route handler. Middleware just checks cookie presence.
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
