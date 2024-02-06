import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { siteConfig } from "./config/site";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const token = request.cookies.get("ps_access_token");

  const authUrls = new Set([
    siteConfig.pages.login.link,
    siteConfig.pages.register.link,
    siteConfig.pages.resetPassword.link,
    siteConfig.pages.verifyEmail.link,
  ]);

  if (token && authUrls.has(request.nextUrl.pathname)) {
    return NextResponse.redirect(
      new URL(siteConfig.pages.dashboard.link, request.url),
    );
  }

  if (!token && !authUrls.has(request.nextUrl.pathname)) {
    return NextResponse.redirect(
      new URL(siteConfig.pages.login.link, request.url),
    );
  }

  return response;
}

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)",
};
