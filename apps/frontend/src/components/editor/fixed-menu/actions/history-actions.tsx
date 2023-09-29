import { GrUndo, GrRedo } from "react-icons/gr";

import type { MenuProps } from "..";
import { MenuAction } from "../menu-action";

export function HistoryActions({ editor }: MenuProps) {
    return (
        <>
            <MenuAction
                editor={editor}
                name="undo"
                icon={<GrUndo />}
                command={() => editor.chain().focus().undo().run()}
                tooltip="Undo"
                shortcut={{
                    mac: "⌘ + Z",
                    pc: "Ctrl + Z",
                }}
            />
            <MenuAction
                editor={editor}
                name="redo"
                icon={<GrRedo />}
                command={() => editor.chain().focus().redo().run()}
                tooltip="Redo"
                shortcut={{
                    mac: "⌘ + Shift + Z",
                    pc: "Ctrl + Shift + Z",
                }}
            />
        </>
    );
}
