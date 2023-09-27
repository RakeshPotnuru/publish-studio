// Only for development use
"use client";

import { Button } from "@itsrakesh/ui";
import { BsFillSunFill } from "react-icons/bs";

export function ThemeToggleButton() {
    const handleToggle = () => {
        document.documentElement.classList.toggle("dark");
    };

    return (
        <Button
            onClick={handleToggle}
            className="text-foreground fixed bottom-4 right-4 z-50"
            size="icon"
        >
            <BsFillSunFill />
        </Button>
    );
}
