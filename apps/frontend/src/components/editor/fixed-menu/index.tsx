import type { Editor } from "@tiptap/react";
import { IoMdImage } from "react-icons/io";
import { RxDividerHorizontal } from "react-icons/rx";

import { MenuAction } from "./menu-action";
import { MenuShell } from "./menu-shell";
import { MenuSeparator } from "./menu-seperator";
import { LinkAction } from "./actions/link-action";
import { TextStyleActions } from "./actions/text-style-actions";
import { NodeActions } from "./actions/node-actions";
import { MarkActions } from "./actions/mark-actions";
import { HistoryActions } from "./actions/history-actions";

export interface MenuProps {
    editor: Editor;
}

interface FixedMenuProps extends MenuProps {}

export function FixedMenu({
    editor,
    ...props
}: FixedMenuProps & React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className="bg-background sticky top-0 z-10 flex flex-row items-center space-x-2 rounded-full p-2 shadow-sm"
            {...props}
        >
            <MenuShell>
                <HistoryActions editor={editor} />
            </MenuShell>
            <MenuSeparator />
            <MenuShell>
                <TextStyleActions editor={editor} />
            </MenuShell>
            <MenuSeparator />
            <MenuShell>
                <MarkActions editor={editor} />
            </MenuShell>
            <MenuSeparator />
            <MenuShell>
                <NodeActions editor={editor} />
            </MenuShell>
            <MenuSeparator />
            <MenuShell>
                <MenuAction
                    editor={editor}
                    name="image"
                    icon={<IoMdImage />}
                    command={() =>
                        editor
                            .chain()
                            .focus()
                            .setImage({ src: "https://picsum.photos/300/200" })
                            .run()
                    }
                    tooltip="Insert Image"
                />
                <LinkAction editor={editor} />
                <MenuAction
                    editor={editor}
                    name="horizontalRule"
                    icon={<RxDividerHorizontal />}
                    command={() => editor.chain().focus().setHorizontalRule().run()}
                    tooltip="Insert Divider"
                />
            </MenuShell>
        </div>
    );
}
