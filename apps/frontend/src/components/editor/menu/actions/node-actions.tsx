import { Icons } from "@/assets/icons";
import type { MenuProps } from "../fixed-menu";
import { MenuAction } from "../menu-action";

export function NodeActions({ editor }: Readonly<MenuProps>) {
    return (
        <>
            <MenuAction
                editor={editor}
                name="blockquote"
                icon={<Icons.Blockquote />}
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
                icon={<Icons.Codeblock />}
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
                icon={<Icons.Bulletlist />}
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
                icon={<Icons.Orderedlist />}
                command={() => editor.chain().focus().toggleOrderedList().run()}
                tooltip="Ordered List"
                shortcut={{
                    mac: "⌘ + Shift + 7",
                    pc: "Ctrl + Shift + 7",
                }}
            />
            <MenuAction
                editor={editor}
                command={() =>
                    editor
                        .chain()
                        .focus()
                        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                        .run()
                }
                icon={<Icons.Table />}
                name="table"
                tooltip="Insert Table"
            />
            <MenuAction
                editor={editor}
                name="horizontalRule"
                icon={<Icons.HorizontalDivider />}
                command={() => editor.chain().focus().setHorizontalRule().run()}
                tooltip="Insert Divider"
            />
            <MenuAction
                editor={editor}
                name="hardbreak"
                icon={<Icons.Hardbreak />}
                command={() => editor.chain().focus().setHardBreak().run()}
                tooltip="Insert Hard Break"
            />
            <MenuAction
                editor={editor}
                name="clearFormatting"
                icon={<Icons.ClearFormatting />}
                command={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
                tooltip="Clear Formatting"
            />
        </>
    );
}
