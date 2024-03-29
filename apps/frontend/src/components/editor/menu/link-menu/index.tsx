import { useCallback, useState } from "react";

import { BubbleMenu as BaseBubbleMenu } from "@tiptap/react";

import { EditLink, LinkPreview } from "../actions/link-action";
import type { MenuProps } from "../fixed-menu";

export const LinkMenu = ({
  editor,
  appendTo,
}: MenuProps): React.JSX.Element => {
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

  const handleCopy = async (): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(link as string);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <BaseBubbleMenu
      editor={editor}
      pluginKey="textMenu"
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
      }}
    >
      {showEdit ? (
        <EditLink editor={editor} link={link} onSetLink={handleSet} />
      ) : (
        link && (
          <LinkPreview
            link={link}
            onEdit={handleEdit}
            onUnset={handleUnset}
            onCopy={handleCopy}
          />
        )
      )}
    </BaseBubbleMenu>
  );
};

export default LinkMenu;
