"use client";

import { Button } from "@itsrakesh/ui";
import { useTheme } from "next-themes";

import { Icons } from "../../assets/icons";

export function ThemeToggleButton() {
    const { theme, setTheme } = useTheme();

    return (
        <Button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-foreground fixed bottom-3 right-14 z-50"
            size="icon"
        >
            <Icons.Sun />
        </Button>
    );
}
