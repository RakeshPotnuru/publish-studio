import { Icons } from "@/assets/icons";
import { useFullscreenStatus } from "@/hooks/use-fullscreen-status";
import { toggleFullscreen } from "@/utils/fullscreen-mode";

import type { MenuProps } from "../fixed-menu";
import { MenuAction } from "../menu-action";

export function FullscreenAction({ editor }: Readonly<MenuProps>) {
    const isFullscreen = useFullscreenStatus();

    return (
        <MenuAction
            editor={editor}
            command={() => toggleFullscreen("editor")}
            icon={isFullscreen ? <Icons.ExitFullscreen /> : <Icons.Fullscreen />}
            name="fullscreen"
            tooltip={isFullscreen ? "Exit Focus Mode" : "Enter Focus Mode"}
        />
    );
}
