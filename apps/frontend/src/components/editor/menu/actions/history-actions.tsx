import { Icons } from "@/assets/icons";
import type { MenuProps } from "../fixed-menu";
import { MenuAction } from "../menu-action";

export function HistoryActions({ editor }: MenuProps) {
    return (
        <>
            <MenuAction
                editor={editor}
                name="undo"
                icon={<Icons.undo />}
                command={() => editor.chain().focus().undo().run()}
                tooltip="Undo"
                shortcut={{
                    mac: "⌘ + Z",
                    pc: "Ctrl + Z",
                }}
                disabled={!editor.can().undo()}
            />
            <MenuAction
                editor={editor}
                name="redo"
                icon={<Icons.redo />}
                command={() => editor.chain().focus().redo().run()}
                tooltip="Redo"
                shortcut={{
                    mac: "⌘ + Shift + Z",
                    pc: "Ctrl + Shift + Z",
                }}
                disabled={!editor.can().redo()}
            />
        </>
    );
}
