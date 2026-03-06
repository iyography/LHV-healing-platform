import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const isQuizSubdomain = hostname.startsWith("quiz.");

  if (isQuizSubdomain) {
    const { pathname } = request.nextUrl;

    // Rewrite root to quiz page
    if (pathname === "/") {
      const url = request.nextUrl.clone();
      url.pathname = "/quiz";
      return NextResponse.rewrite(url);
    }

    // Allow quiz page and API routes
    if (pathname.startsWith("/quiz") || pathname.startsWith("/api/quiz") || pathname.startsWith("/_next") || pathname.startsWith("/favicon") || pathname.match(/\.\w+$/)) {
      return NextResponse.next();
    }

    // Block all other routes on quiz subdomain
    const url = request.nextUrl.clone();
    url.pathname = "/quiz";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
