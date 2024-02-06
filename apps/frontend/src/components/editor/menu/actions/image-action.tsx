import { useState } from "react";

import { Icons } from "@/assets/icons";
import type { TInsertImageOptions } from "@/components/modules/dashboard/assets/image-widget";
import { ImageWidget } from "@/components/modules/dashboard/assets/image-widget";

import { deserialize } from "../../transform-markdown";
import type { MenuProps } from "../fixed-menu";
import { MenuAction } from "../menu-action";

export function ImageAction({ editor }: Readonly<MenuProps>) {
  const [open, setOpen] = useState(false);

  const handleImageInsert = ({
    src,
    alt,
    title,
    hasCaption,
    captionMarkdown,
  }: TInsertImageOptions) => {
    setOpen(false);
    editor.chain().focus().setImage({ src, alt, title }).run();
    if (hasCaption) {
      const deserialized = deserialize(editor.schema, captionMarkdown);

      editor
        .chain()
        .focus()
        .insertContentAt(editor.state.selection.anchor + 1, deserialized)
        .run();
    }
  };

  return (
    <>
      <MenuAction
        editor={editor}
        name="image"
        icon={<Icons.Image />}
        command={() => setOpen(true)}
        tooltip="Insert Image"
      />
      <ImageWidget
        open={open}
        onOpenChange={setOpen}
        isWidget={true}
        onImageInsert={handleImageInsert}
      />
    </>
  );
}
