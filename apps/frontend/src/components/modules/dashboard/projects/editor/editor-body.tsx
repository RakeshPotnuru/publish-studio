import { EditorContent, type Editor } from "@tiptap/react";

export function EditorBody({ editor }: { editor: Editor }) {
    return <EditorContent editor={editor} />;
}
