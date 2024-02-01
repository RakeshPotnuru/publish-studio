"use client";

import { Button } from "@itsrakesh/ui";
import { useTheme } from "next-themes";

import { Icons } from "../../assets/icons";

export function ThemeToggleButton() {
    const { theme, setTheme } = useTheme();

    return (
        <aside>
            <Button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="fixed bottom-3 right-14 z-50 text-foreground"
                size="icon"
            >
                <Icons.Sun />
            </Button>
        </aside>
    );
}
