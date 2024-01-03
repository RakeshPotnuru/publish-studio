import { Icons } from "@/assets/icons";
import { shortenText } from "@/utils/text-shortener";
import { Button } from "@itsrakesh/ui";
import type { IProject } from "@publish-studio/core";

interface ProjectToolbarProps {
    project: IProject;
}

export function ProjectToolbar({ project }: Readonly<ProjectToolbarProps>) {
    return (
        <div className="bg-background sticky top-0 z-10 flex justify-between rounded-full p-2 shadow-sm">
            <Button variant="ghost">{shortenText(project.name, 20)}</Button>
            <div>
                <Button variant="ghost" size="icon">
                    <Icons.Settings />
                </Button>
            </div>
        </div>
    );
}
