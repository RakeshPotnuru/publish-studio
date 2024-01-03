import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@itsrakesh/ui";

import type { IProject } from "@publish-studio/core";

import { Tooltip } from "@/components/ui/tooltip";

interface ProjectSettingsProps extends React.HTMLAttributes<HTMLDivElement> {
    project: IProject;
}

export function ProjectSettings({ children, project, ...props }: ProjectSettingsProps) {
    return (
        <Sheet {...props}>
            <Tooltip content="Settings">
                <SheetTrigger asChild>{children}</SheetTrigger>
            </Tooltip>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Settings</SheetTitle>
                    <SheetDescription>Your project settings.</SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    );
}
