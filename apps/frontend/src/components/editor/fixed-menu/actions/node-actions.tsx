import { Icons } from "@/components/ui/icons";
import type { MenuProps } from "..";
import { MenuAction } from "../menu-action";

export function NodeActions({ editor }: MenuProps) {
    return (
        <>
            <MenuAction
                editor={editor}
                name="blockquote"
                icon={<Icons.blockquote />}
                command={() => editor.chain().focus().toggleBlockquote().run()}
                tooltip="Blockquote"
                shortcut={{
                    mac: "⌘ + Shift + B",
                    pc: "Ctrl + Shift + B",
                }}
            />
            <MenuAction
                editor={editor}
                name="codeblock"
                icon={<Icons.codeblock />}
                command={() => editor.chain().focus().toggleCodeBlock().run()}
                tooltip="Code Block"
                shortcut={{
                    mac: "⌘ + Option + C",
                    pc: "Ctrl + Alt + C",
                }}
            />
            <MenuAction
                editor={editor}
                name="bulletlist"
                icon={<Icons.bulletlist />}
                command={() => editor.chain().focus().toggleBulletList().run()}
                tooltip="Bullet List"
                shortcut={{
                    mac: "⌘ + Shift + 8",
                    pc: "Ctrl + Shift + 8",
                }}
            />
            <MenuAction
                editor={editor}
                name="orderedlist"
                icon={<Icons.orderedlist />}
                command={() => editor.chain().focus().toggleBulletList().run()}
                tooltip="Ordered List"
                shortcut={{
                    mac: "⌘ + Shift + 7",
                    pc: "Ctrl + Shift + 7",
                }}
            />
        </>
    );
}
