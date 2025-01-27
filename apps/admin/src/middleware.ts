import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { jwtDecode } from "jwt-decode";

import { siteConfig } from "./config/site";
import { createTRPCServerClient } from "./utils/trpc";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const accessToken = request.cookies.get("access_token");
  const refreshToken = request.cookies.get("refresh_token");

  const authUrls = new Set([siteConfig.pages.login.link]);

  if (accessToken && authUrls.has(request.nextUrl.pathname)) {
    return NextResponse.redirect(
      new URL(siteConfig.pages.dashboard.link, request.url),
    );
  }

  if (!refreshToken && !authUrls.has(request.nextUrl.pathname)) {
    return NextResponse.redirect(
      new URL(siteConfig.pages.login.link, request.url),
    );
  }

  if (!accessToken && refreshToken && !authUrls.has(request.nextUrl.pathname)) {
    try {
      const client = createTRPCServerClient({
        Cookie: `refresh_token=${refreshToken.value}`,
      });

      const { data } = await client.auth.refresh.query();

      if (!data.access_token) {
        return NextResponse.redirect(
          new URL(siteConfig.pages.login.link, request.url),
        );
      }

      const accessTokenDecoded = jwtDecode<{ exp: number }>(data.access_token);

      response.cookies.set("access_token", data.access_token, {
        path: "/",
        sameSite: "lax",
        expires: new Date(accessTokenDecoded.exp * 1000),
        secure: process.env.NODE_ENV === "production",
      });

      return response;
    } catch {
      return NextResponse.redirect(
        new URL(siteConfig.pages.login.link, request.url),
      );
    }
  }

  return response;
}

export const config = {
  matcher: [
    {
      source: "/((?!api|static|.*\\..*|_next).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
