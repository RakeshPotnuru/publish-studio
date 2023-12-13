import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@itsrakesh/ui";

import { MenuProps } from "@/components/modules/dashboard/projects/editor/menu/fixed-menu";
import { DownloadProject } from "./download-project";
import { ImportMarkdown } from "./import-content";

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
                <div className="my-4 space-y-4">
                    <ImportMarkdown editor={editor} />
                    <DownloadProject editor={editor} />
                </div>
            </SheetContent>
        </Sheet>
    );
}
