"use client";

import LogRocket from "logrocket";
import { useEffect } from "react";

export default function LogRocketProvider() {
    useEffect(() => {
        if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_LOGROCKET_PROJECT_ID) {
            LogRocket.init(process.env.NEXT_PUBLIC_LOGROCKET_PROJECT_ID);
        }
    }, []);

    return null;
}
