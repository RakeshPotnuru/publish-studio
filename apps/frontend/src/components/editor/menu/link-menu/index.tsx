import { useCallback, useState } from "react";

import { BubbleMenu as BaseBubbleMenu } from "@tiptap/react";

import { EditLink, LinkPreview } from "../action/link";
import type { MenuProps } from "../fixed-menu";

export const LinkMenu = ({ editor, appendTo }: MenuProps) => {
  const [showEdit, setShowEdit] = useState(false);

  const shouldShow = useCallback(() => {
    return editor.isActive("link");
  }, [editor]);

  const { href: link } = editor.getAttributes("link");

  const handleEdit = useCallback(() => {
    setShowEdit(true);
  }, []);

  const handleSet = useCallback(
    (url: string) => {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url, target: "_blank" })
        .run();
      setShowEdit(false);
    },
    [editor],
  );

  const handleUnset = useCallback(() => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    setShowEdit(false);
    return null;
  }, [editor]);

  return (
    <BaseBubbleMenu
      editor={editor}
      pluginKey="linkMenu"
      shouldShow={shouldShow}
      updateDelay={0}
      tippyOptions={{
        popperOptions: {
          modifiers: [{ enabled: false }],
        },
        appendTo: () => {
          return appendTo?.current as HTMLElement;
        },
        onHidden: () => {
          setShowEdit(false);
        },
        zIndex: 40,
      }}
    >
      {showEdit ? (
        <EditLink editor={editor} link={link} onSetLink={handleSet} />
      ) : (
        link && (
          <LinkPreview link={link} onEdit={handleEdit} onUnset={handleUnset} />
        )
      )}
    </BaseBubbleMenu>
  );
};

export default LinkMenu;
