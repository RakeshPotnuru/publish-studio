"use client";

import { CookiesProvider as PSCookiesProvider } from "react-cookie";

export function CookiesProvider({ children }: Readonly<{ children: React.ReactNode }>) {
    return <PSCookiesProvider>{children}</PSCookiesProvider>;
}
