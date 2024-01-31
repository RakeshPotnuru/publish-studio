import { EditorContent } from "@tiptap/react";

import type { MenuProps } from "./menu/fixed-menu";

export function EditorBody({ editor }: Readonly<MenuProps>) {
    return <EditorContent editor={editor} />;
}
