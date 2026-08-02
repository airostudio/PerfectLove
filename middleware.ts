import { NextRequest, NextResponse } from "next/server";

// Auth protection disabled during development.
// Re-enable by restoring the Supabase session check below.
export async function middleware(_req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/reading/:path*", "/auth"],
};
