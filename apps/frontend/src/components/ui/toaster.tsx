"use client";

import { Toaster as PSToaster, ToasterProps } from "@itsrakesh/ui";
import { useTheme } from "next-themes";

export function Toaster() {
    const { theme } = useTheme();

    return (
        <PSToaster
            theme={theme as ToasterProps["theme"]}
            position="bottom-center"
            duration={5000}
            visibleToasts={5}
            closeButton
            richColors
        />
    );
}
