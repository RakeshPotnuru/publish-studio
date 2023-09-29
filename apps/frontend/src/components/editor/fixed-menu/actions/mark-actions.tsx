import { AiOutlineStrikethrough } from "react-icons/ai";
import { BiCode } from "react-icons/bi";
import { FiItalic, FiUnderline } from "react-icons/fi";
import { GoBold } from "react-icons/go";

import type { MenuProps } from "..";
import { MenuAction } from "../menu-action";

export function MarkActions({ editor }: MenuProps) {
    return (
        <>
            <MenuAction
                editor={editor}
                name="bold"
                icon={<GoBold />}
                command={() => editor.chain().focus().toggleBold().run()}
                tooltip="Bold"
                shortcut={{
                    mac: "⌘ + B",
                    pc: "Ctrl + B",
                }}
            />
            <MenuAction
                editor={editor}
                name="italic"
                icon={<FiItalic />}
                command={() => editor.chain().focus().toggleItalic().run()}
                tooltip="Italic"
                shortcut={{
                    mac: "⌘ + I",
                    pc: "Ctrl + I",
                }}
            />
            <MenuAction
                editor={editor}
                name="underline"
                icon={<FiUnderline />}
                command={() => editor.chain().focus().toggleUnderline().run()}
                tooltip="Underline"
                shortcut={{
                    mac: "⌘ + U",
                    pc: "Ctrl + U",
                }}
            />
            <MenuAction
                editor={editor}
                name="strike"
                icon={<AiOutlineStrikethrough />}
                command={() => editor.chain().focus().toggleStrike().run()}
                tooltip="Strike"
                shortcut={{
                    mac: "⌘ + Shift + X",
                    pc: "Ctrl + Shift + X",
                }}
            />
            <MenuAction
                editor={editor}
                name="code"
                icon={<BiCode />}
                command={() => editor.chain().focus().toggleCode().run()}
                tooltip="Code"
                shortcut={{
                    mac: "⌘ + E",
                    pc: "Ctrl + E",
                }}
            />
        </>
    );
}
