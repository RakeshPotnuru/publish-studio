import { Icons } from "@/assets/icons";

import type { MenuProps } from "../fixed-menu";
import { MenuAction } from "../menu-action";

export function MarkActions({ editor, isBubbleMenu }: Readonly<MenuProps>) {
  return (
    <>
      <MenuAction
        editor={editor}
        name="bold"
        icon={<Icons.Bold />}
        command={() => editor.chain().focus().toggleBold().run()}
        tooltip="Bold"
        shortcut={{
          mac: "⌘ + B",
          pc: "Ctrl + B",
        }}
        isBubbleMenu={isBubbleMenu}
      />
      <MenuAction
        editor={editor}
        name="italic"
        icon={<Icons.Italic />}
        command={() => editor.chain().focus().toggleItalic().run()}
        tooltip="Italic"
        shortcut={{
          mac: "⌘ + I",
          pc: "Ctrl + I",
        }}
        isBubbleMenu={isBubbleMenu}
      />
      <MenuAction
        editor={editor}
        name="underline"
        icon={<Icons.Underline />}
        command={() => editor.chain().focus().toggleUnderline().run()}
        tooltip="Underline"
        shortcut={{
          mac: "⌘ + U",
          pc: "Ctrl + U",
        }}
        isBubbleMenu={isBubbleMenu}
      />
      <MenuAction
        editor={editor}
        name="strike"
        icon={<Icons.Strike />}
        command={() => editor.chain().focus().toggleStrike().run()}
        tooltip="Strike"
        shortcut={{
          mac: "⌘ + Shift + X",
          pc: "Ctrl + Shift + X",
        }}
        isBubbleMenu={isBubbleMenu}
      />
      <MenuAction
        editor={editor}
        name="code"
        icon={<Icons.Code />}
        command={() => editor.chain().focus().toggleCode().run()}
        tooltip="Code"
        shortcut={{
          mac: "⌘ + E",
          pc: "Ctrl + E",
        }}
        isBubbleMenu={isBubbleMenu}
      />
    </>
  );
}
