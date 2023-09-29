import { AiOutlineUnorderedList, AiOutlineOrderedList } from "react-icons/ai";
import { PiCodeBlockBold } from "react-icons/pi";
import { TbBlockquote } from "react-icons/tb";

import type { MenuProps } from "..";
import { MenuAction } from "../menu-action";

export function NodeActions({ editor }: MenuProps) {
    return (
        <>
            <MenuAction
                editor={editor}
                name="blockquote"
                icon={<TbBlockquote />}
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
                icon={<PiCodeBlockBold />}
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
                icon={<AiOutlineUnorderedList />}
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
                icon={<AiOutlineOrderedList />}
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
