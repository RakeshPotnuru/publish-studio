import type { Editor } from "@tiptap/react";

import { Icons } from "@/components/ui/icons";
import { MenuShell } from "@/components/ui/shell";
import { HistoryActions } from "./actions/history-actions";
import { LinkAction } from "./actions/link-action";
import { MarkActions } from "./actions/mark-actions";
import { NodeActions } from "./actions/node-actions";
import { TextStyleActions } from "./actions/text-style-actions";
import { MenuAction } from "./menu-action";
import { MenuSeparator } from "./menu-seperator";

export interface MenuProps {
    editor: Editor;
    isBubbleMenu?: boolean;
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
                    icon={<Icons.image />}
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
                    icon={<Icons.divider />}
                    command={() => editor.chain().focus().setHorizontalRule().run()}
                    tooltip="Insert Divider"
                />
            </MenuShell>
        </div>
    );
}
