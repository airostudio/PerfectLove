import { NextRequest, NextResponse } from "next/server";

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

function isAdminAuthenticated(req: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  const token = req.cookies.get("admin_token")?.value ?? "";
  return token.length > 0 && timingSafeEqual(token, secret);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Login page and auth endpoint are public
  if (pathname === "/admin/login" || pathname === "/api/admin/auth") {
    return NextResponse.next();
  }

  // All /admin and /api/admin routes require a valid admin_token cookie
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (!isAdminAuthenticated(req)) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  // User auth protection disabled during development — re-enable here when ready
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/dashboard/:path*",
    "/reading/:path*",
    "/auth",
  ],
};
