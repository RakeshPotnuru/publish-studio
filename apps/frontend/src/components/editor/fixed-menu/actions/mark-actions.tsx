import { Icons } from "@/components/ui/icons";
import type { MenuProps } from "..";
import { MenuAction } from "../menu-action";

export function MarkActions({ editor, isBubbleMenu }: MenuProps) {
    return (
        <>
            <MenuAction
                editor={editor}
                name="bold"
                icon={<Icons.bold />}
                command={() => editor.chain().focus().toggleBold().run()}
                tooltip="Bold"
                shortcut={{
                    mac: "⌘ + B",
                    pc: "Ctrl + B",
                }}
                isBubbleMenu={isBubbleMenu}
            />
            <MenuAction
                editor={editor}
                name="italic"
                icon={<Icons.italic />}
                command={() => editor.chain().focus().toggleItalic().run()}
                tooltip="Italic"
                shortcut={{
                    mac: "⌘ + I",
                    pc: "Ctrl + I",
                }}
                isBubbleMenu={isBubbleMenu}
            />
            <MenuAction
                editor={editor}
                name="underline"
                icon={<Icons.underline />}
                command={() => editor.chain().focus().toggleUnderline().run()}
                tooltip="Underline"
                shortcut={{
                    mac: "⌘ + U",
                    pc: "Ctrl + U",
                }}
                isBubbleMenu={isBubbleMenu}
            />
            <MenuAction
                editor={editor}
                name="strike"
                icon={<Icons.strike />}
                command={() => editor.chain().focus().toggleStrike().run()}
                tooltip="Strike"
                shortcut={{
                    mac: "⌘ + Shift + X",
                    pc: "Ctrl + Shift + X",
                }}
                isBubbleMenu={isBubbleMenu}
            />
            <MenuAction
                editor={editor}
                name="code"
                icon={<Icons.code />}
                command={() => editor.chain().focus().toggleCode().run()}
                tooltip="Code"
                shortcut={{
                    mac: "⌘ + E",
                    pc: "Ctrl + E",
                }}
                isBubbleMenu={isBubbleMenu}
            />
        </>
    );
}
