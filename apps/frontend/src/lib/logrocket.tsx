"use client";

import LogRocket from "logrocket";
import { useEffect } from "react";

import { env } from "@/config/env";

export default function LogRocketProvider() {
    useEffect(() => {
        if (typeof window !== "undefined") {
            LogRocket.init(env.NEXT_PUBLIC_LOGROCKET_PROJECT_ID);
        }
    }, []);

    return null;
}
