import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { timingSafeEqual } from "@/lib/timing-safe-equal";

function isAdminAuthenticated(req: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  const token = req.cookies.get("admin_token")?.value ?? "";
  return token.length > 0 && timingSafeEqual(token, secret);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Start with a response that we'll carry forward (holds refreshed cookies)
  const res = NextResponse.next();

  // Refresh Supabase session on every protected request
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            req.cookies.set(name, value);
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Trigger session refresh (writes updated tokens into res cookies if needed)
  await supabase.auth.getUser();

  // Login page and auth endpoint are public
  if (pathname === "/admin/login" || pathname === "/api/admin/auth") {
    return res;
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

  // No middleware-level gate for /dashboard, /reading, or /auth — by design,
  // not because it's disabled. /dashboard checks the session itself
  // (app/dashboard/page.tsx) and scopes its query to that session's email.
  // /reading/view/[orderId] is an intentionally unauthenticated capability
  // link (mailed to purchasers, keyed by an unguessable UUID) so it works
  // without requiring sign-in. If a future route under these matcher paths
  // needs real access control, add it explicitly here or in the route/page
  // itself — don't assume this middleware already covers it.
  return res;
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
