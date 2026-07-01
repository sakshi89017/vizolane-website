/**
 * Next.js Middleware for subdomain routing.
 * Routes dashboard.vizolane.com → /admin pages.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const { pathname } = request.nextUrl;

  /* ── Dashboard subdomain routing ─────────────── */
  const isDashboard =
    hostname.startsWith("dashboard.") ||
    hostname.startsWith("dashboard-");

  if (isDashboard && !pathname.startsWith("/admin") && !pathname.startsWith("/api")) {
    const url = request.nextUrl.clone();
    url.pathname = `/admin${pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (browser icon)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|images/).*)",
  ],
};
