import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarShortcut,
    MenubarTrigger,
} from "@itsrakesh/ui";
import { useEffect, useState } from "react";

import getOs from "@/lib/get-os";
import type { MenuProps } from "../fixed-menu";

export function TextStyleActions({ editor }: MenuProps) {
    const [activeTextStyle, setActiveTextStyle] = useState<
        "Normal Text" | "Heading 1" | "Heading 2" | "Heading 3"
    >("Normal Text");

    const os = getOs();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.altKey) {
                switch (e.key) {
                    case "º":
                        e.preventDefault();
                        setActiveTextStyle("Normal Text");
                        break;
                    case "¡":
                        e.preventDefault();
                        setActiveTextStyle("Heading 1");
                        break;
                    case "™":
                        e.preventDefault();
                        setActiveTextStyle("Heading 2");
                        break;
                    case "£":
                        e.preventDefault();
                        setActiveTextStyle("Heading 3");
                        break;
                    default:
                }
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    return (
        <Menubar>
            <MenubarMenu>
                <MenubarTrigger className="whitespace-nowrap">{activeTextStyle}</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem
                        onClick={() => {
                            editor.chain().focus().setParagraph().run();
                            setActiveTextStyle("Normal Text");
                        }}
                    >
                        Normal Text
                        <MenubarShortcut>
                            {os === "mac" ? "⌘ Option 0" : "Ctrl Alt 0"}
                        </MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem
                        onClick={() => {
                            editor.chain().focus().toggleHeading({ level: 1 }).run();
                            setActiveTextStyle("Heading 1");
                        }}
                    >
                        Heading 1
                        <MenubarShortcut>
                            {os === "mac" ? "⌘ Option 1" : "Ctrl Alt 1"}
                        </MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem
                        onClick={() => {
                            editor.chain().focus().toggleHeading({ level: 2 }).run();
                            setActiveTextStyle("Heading 2");
                        }}
                    >
                        Heading 2
                        <MenubarShortcut>
                            {os === "mac" ? "⌘ Option 2" : "Ctrl Alt 2"}
                        </MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem
                        onClick={() => {
                            editor.chain().focus().toggleHeading({ level: 3 }).run();
                            setActiveTextStyle("Heading 3");
                        }}
                    >
                        Heading 3
                        <MenubarShortcut>
                            {os === "mac" ? "⌘ Option 3" : "Ctrl Alt 3"}
                        </MenubarShortcut>
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    );
}
