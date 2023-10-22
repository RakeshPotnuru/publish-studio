import { BubbleMenu as TiptapBubbleMenu } from "@tiptap/react";

import { MenuShell } from "@/components/ui/shell";
import type { MenuProps } from "../fixed-menu";
import { LinkAction } from "../fixed-menu/actions/link-action";
import { MarkActions } from "../fixed-menu/actions/mark-actions";
import { MenuSeparator } from "../fixed-menu/menu-seperator";

interface BubbleMenuProps extends MenuProps {}

export function BubbleMenu({ editor }: BubbleMenuProps) {
    return (
        <TiptapBubbleMenu editor={editor}>
            <div className="bg-popover flex flex-row items-center space-x-2 rounded-lg p-2 shadow-lg ">
                <MenuShell>
                    <MarkActions editor={editor} />
                </MenuShell>
                <MenuSeparator />
                <MenuShell>
                    <LinkAction editor={editor} />
                </MenuShell>
            </div>
        </TiptapBubbleMenu>
    );
}
