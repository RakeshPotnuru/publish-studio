"use client";

import { toast } from "@itsrakesh/ui";
import { useEffect, useState } from "react";

export function NetworkStatusToast() {
    const [online, setOnline] = useState(typeof window !== "undefined" && navigator.onLine);

    useEffect(() => {
        const handleOnline = () => {
            setOnline(true);
            toast.success("Back online.");
        };

        const handleOffline = () => {
            setOnline(false);
            toast.error("You are offline.");
        };

        if (typeof window !== "undefined") {
            window.addEventListener("online", handleOnline);
            window.addEventListener("offline", handleOffline);

            return () => {
                window.removeEventListener("online", handleOnline);
                window.removeEventListener("offline", handleOffline);
            };
        }
    }, [online]);

    return null;
}
