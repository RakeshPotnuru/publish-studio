import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@itsrakesh/ui";

import type { IProject } from "@publish-studio/core";

import { MenuProps } from "@/components/modules/dashboard/projects/editor/menu/fixed-menu";
import { Tooltip } from "@/components/ui/tooltip";
import { DownloadProject } from "./download-project";
import { GenerateOutline } from "./generate-outline";
import { ImportMarkdown } from "./import-content";
import { ToneAnalysis } from "./tone-analysis";

interface ProjectToolsProps extends React.HTMLAttributes<HTMLDivElement> {
    project: IProject;
}

export function ProjectTools({
    children,
    editor,
    project,
    ...props
}: ProjectToolsProps & MenuProps) {
    return (
        <Sheet {...props}>
            <Tooltip content="Tools">
                <SheetTrigger asChild>{children}</SheetTrigger>
            </Tooltip>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Tools</SheetTitle>
                    <SheetDescription>Tools to help you manage your project.</SheetDescription>
                </SheetHeader>
                <div className="my-4 space-y-6">
                    <ImportMarkdown editor={editor} />
                    <DownloadProject editor={editor} project={project} />
                    <GenerateOutline editor={editor} project_id={project._id} />
                    <ToneAnalysis editor={editor} project={project} />
                </div>
            </SheetContent>
        </Sheet>
    );
}
