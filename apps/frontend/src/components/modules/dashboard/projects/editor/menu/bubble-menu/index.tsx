import { BubbleMenu as TiptapBubbleMenu } from "@tiptap/react";

import { MenuShell } from "@/components/ui/layouts/shell";
import { LinkAction } from "../actions/link-action";
import { MarkActions } from "../actions/mark-actions";
import type { MenuProps } from "../fixed-menu";
import { MenuSeparator } from "../menu-separator";

interface BubbleMenuProps extends MenuProps {}

export function BubbleMenu({ editor }: BubbleMenuProps) {
    return (
        <TiptapBubbleMenu
            editor={editor}
            shouldShow={({ editor, state }) =>
                !state.selection.empty &&
                (editor.isActive("paragraph") || editor.isActive("heading"))
            }
        >
            <div className="bg-popover text-popover-foreground flex flex-row items-center rounded-md border shadow-md">
                <MenuShell>
                    <MarkActions editor={editor} isBubbleMenu />
                </MenuShell>
                <MenuSeparator isBubbleMenu />
                <MenuShell>
                    <LinkAction editor={editor} isBubbleMenu />
                </MenuShell>
            </div>
        </TiptapBubbleMenu>
    );
}
