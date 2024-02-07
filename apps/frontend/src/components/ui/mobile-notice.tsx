"use client";

import { useEffect, useState } from "react";

import { Icons } from "@/assets/icons";

import { Center } from "./center";

export function MobileNotice({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      const userAgent = navigator.userAgent;
      setIsMobile(
        /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
          userAgent,
        ),
      );
    }
  }, []);

  return isMobile ? (
    <Center className="flex h-screen flex-col items-center space-y-4 bg-white text-muted-foreground">
      <Icons.MobileOff className="size-20" />
      <p>
        This application is not optimized for mobile yet. Please use a desktop
        browser.
      </p>
    </Center>
  ) : (
    children
  );
}
