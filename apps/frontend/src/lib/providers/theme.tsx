"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({
  children,
  ...props
}: Readonly<ThemeProviderProps>) {
  if (process.env.NODE_ENV === "production") {
    console.log("%cAlert!", "color: red; font-size: 50px;");
    console.log(
      "%cClose this and do not paste anything here to keep yourself safe from scams.",
      "color: red; font-size: 20px;",
    );
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
