import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@itsrakesh/ui";

import { MenuProps } from "@/components/editor/menu/fixed-menu";
import { ImportMarkdown } from "./import-markdown";

interface ProjectToolsProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ProjectTools({ children, editor, ...props }: ProjectToolsProps & MenuProps) {
    return (
        <Sheet {...props}>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Tools</SheetTitle>
                    <SheetDescription>Tools to help you manage your project.</SheetDescription>
                </SheetHeader>
                <div className="my-4">
                    <ImportMarkdown editor={editor} />
                </div>
            </SheetContent>
        </Sheet>
    );
}
