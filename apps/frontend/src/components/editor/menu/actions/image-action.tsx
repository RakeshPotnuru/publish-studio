import { useState } from "react";

import { Icons } from "@/assets/icons";
import { ImageWidget } from "@/components/ui/image-widget";
import { MenuProps } from "../fixed-menu";
import { MenuAction } from "../menu-action";

export function ImageAction({ editor }: MenuProps) {
    const [open, setOpen] = useState(false);

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
                onAdd={url => {
                    setOpen(false);
                    editor.chain().focus().setImage({ src: url }).run();
                }}
            />
        </>
    );
}
