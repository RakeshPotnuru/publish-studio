import { useEffect, useState } from "react";

import { Icons } from "@/components/ui/icons";
import { toggleFullscreen } from "@/lib/fullscreen-mode";
import { MenuProps } from "../fixed-menu";
import { MenuAction } from "../menu-action";

export function FullscreenAction({ editor }: MenuProps) {
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(document.fullscreenElement !== null);
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);

        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
    }, []);

    return (
        <MenuAction
            editor={editor}
            command={() => toggleFullscreen("editor")}
            icon={isFullscreen ? <Icons.fullscreenexit /> : <Icons.fullscreen />}
            name="fullscreen"
            tooltip={isFullscreen ? "Exit Focus Mode" : "Enter Focus Mode"}
        />
    );
}
