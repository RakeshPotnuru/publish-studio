import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { siteConfig } from "./config/site";

export function middleware(request: NextRequest) {
    const response = NextResponse.next();
    const token = request.cookies.get("ps_access_token");

    if (
        token &&
        (request.nextUrl.pathname.startsWith(siteConfig.pages.login.link) ||
            request.nextUrl.pathname.startsWith(siteConfig.pages.register.link))
    ) {
        return NextResponse.redirect(new URL(siteConfig.pages.dashboard.link, request.url));
    }

    if (
        !token &&
        !request.nextUrl.pathname.startsWith(siteConfig.pages.login.link) &&
        !request.nextUrl.pathname.startsWith(siteConfig.pages.register.link)
    ) {
        return NextResponse.redirect(new URL(siteConfig.pages.login.link, request.url));
    }

    return response;
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
