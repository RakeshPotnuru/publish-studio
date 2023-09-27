import {
    Button,
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Separator,
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";
import type { Editor } from "@tiptap/react";
import { GrRedo, GrUndo } from "react-icons/gr";
import { GoBold } from "react-icons/go";
import { FiItalic, FiUnderline } from "react-icons/fi";
import {
    AiOutlineLink,
    AiOutlineOrderedList,
    AiOutlineStrikethrough,
    AiOutlineUnorderedList,
} from "react-icons/ai";
import { BiCode } from "react-icons/bi";
import { TbBlockquote } from "react-icons/tb";
import { PiCodeBlockBold } from "react-icons/pi";
import { IoMdImage } from "react-icons/io";

interface MenuProps extends React.HTMLAttributes<HTMLDivElement> {
    editor: Editor;
}

const MenuItem = ({
    editor,
    item,
    command,
    icon,
    tooltip,
}: MenuProps & { item: string; command: () => void; icon: React.ReactNode; tooltip: string }) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        onClick={command}
                        variant="ghost"
                        size="icon"
                        className={cn("rounded-lg text-lg", {
                            "bg-accent": editor.isActive(item),
                        })}
                    >
                        {icon}
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                    <p>{tooltip}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

const MenuShell = ({ children }: { children: React.ReactNode }) => {
    return <div className="flex flex-row space-x-1">{children}</div>;
};

const MenuSeparator = () => {
    return <Separator orientation="vertical" className="h-6 bg-gray-500" />;
};

interface FixedMenuProps extends MenuProps {}

export function FixedMenu({ editor, ...props }: FixedMenuProps) {
    return (
        <div
            className="bg-background sticky top-0 z-10 flex flex-row items-center space-x-2 rounded-full p-2 shadow-sm"
            {...props}
        >
            <MenuShell>
                <MenuItem
                    editor={editor}
                    item="undo"
                    icon={<GrUndo />}
                    command={() => editor.chain().focus().undo().run()}
                    tooltip="Undo"
                />
                <MenuItem
                    editor={editor}
                    item="redo"
                    icon={<GrRedo />}
                    command={() => editor.chain().focus().redo().run()}
                    tooltip="Redo"
                />
            </MenuShell>
            <MenuSeparator />
            <MenuShell>
                <Select
                    defaultValue="normal"
                    onValueChange={value => {
                        if (value === "heading1") {
                            editor.chain().focus().toggleHeading({ level: 1 }).run();
                        } else if (value === "heading2") {
                            editor.chain().focus().toggleHeading({ level: 2 }).run();
                        } else if (value === "heading3") {
                            editor.chain().focus().toggleHeading({ level: 3 }).run();
                        } else if (value === "heading4") {
                            editor.chain().focus().toggleHeading({ level: 4 }).run();
                        } else {
                            editor.chain().focus().setParagraph().run();
                        }
                    }}
                >
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                                <p>Styles</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="normal">Normal Text</SelectItem>
                            <SelectItem value="heading1">Heading 1</SelectItem>
                            <SelectItem value="heading2">Heading 2</SelectItem>
                            <SelectItem value="heading3">Heading 3</SelectItem>
                            <SelectItem value="heading4">Heading 4</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </MenuShell>
            <MenuSeparator />
            <MenuShell>
                <MenuItem
                    editor={editor}
                    item="bold"
                    icon={<GoBold />}
                    command={() => editor.chain().focus().toggleBold().run()}
                    tooltip="Bold"
                />
                <MenuItem
                    editor={editor}
                    item="italic"
                    icon={<FiItalic />}
                    command={() => editor.chain().focus().toggleItalic().run()}
                    tooltip="Italic"
                />
                <MenuItem
                    editor={editor}
                    item="underline"
                    icon={<FiUnderline />}
                    command={() => editor.chain().focus().toggleUnderline().run()}
                    tooltip="Underline"
                />
                <MenuItem
                    editor={editor}
                    item="strike"
                    icon={<AiOutlineStrikethrough />}
                    command={() => editor.chain().focus().toggleStrike().run()}
                    tooltip="Strike"
                />
                <MenuItem
                    editor={editor}
                    item="code"
                    icon={<BiCode />}
                    command={() => editor.chain().focus().toggleCode().run()}
                    tooltip="Code"
                />
            </MenuShell>
            <MenuSeparator />
            <MenuShell>
                <MenuItem
                    editor={editor}
                    item="blockquote"
                    icon={<TbBlockquote />}
                    command={() => editor.chain().focus().toggleBlockquote().run()}
                    tooltip="Blockquote"
                />
                <MenuItem
                    editor={editor}
                    item="codeblock"
                    icon={<PiCodeBlockBold />}
                    command={() => editor.chain().focus().toggleCodeBlock().run()}
                    tooltip="Code Block"
                />
                <MenuItem
                    editor={editor}
                    item="bulletlist"
                    icon={<AiOutlineUnorderedList />}
                    command={() => editor.chain().focus().toggleBulletList().run()}
                    tooltip="Bullet List"
                />
                <MenuItem
                    editor={editor}
                    item="orderedlist"
                    icon={<AiOutlineOrderedList />}
                    command={() => editor.chain().focus().toggleBulletList().run()}
                    tooltip="Ordered List"
                />
            </MenuShell>
            <MenuSeparator />
            <MenuShell>
                <MenuItem
                    editor={editor}
                    item="image"
                    icon={<IoMdImage />}
                    command={() =>
                        editor
                            .chain()
                            .focus()
                            .setImage({ src: "https://picsum.photos/300/200" })
                            .run()
                    }
                    tooltip="Insert Image"
                />
                <MenuItem
                    editor={editor}
                    item="link"
                    icon={<AiOutlineLink />}
                    command={() =>
                        editor.chain().focus().toggleLink({ href: "https://example.com" }).run()
                    }
                    tooltip="Insert Link"
                />
            </MenuShell>
        </div>
    );
}
