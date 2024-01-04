import { Button } from "@itsrakesh/ui";

import type { IProject } from "@publish-studio/core";

import { Icons } from "@/assets/icons";
import { shortenText } from "@/utils/text-shortener";
import { PublishPost } from "../publish-post";
import { ProjectSettings } from "../settings";
import { ProjectTools } from "../tools";
import { MenuProps } from "./menu/fixed-menu";

interface ProjectToolbarProps extends MenuProps {
    project: IProject;
}

export function ProjectToolbar({ project, editor }: Readonly<ProjectToolbarProps>) {
    return (
        <div className="bg-background sticky top-0 z-10 flex justify-between rounded-full p-2 shadow-sm">
            <Button variant="ghost">{shortenText(project.name, 20)}</Button>
            <div className="flow-row flex space-x-1">
                <PublishPost editor={editor} project={project}>
                    <Button variant="secondary">Publish</Button>
                </PublishPost>
                <ProjectTools editor={editor} project={project}>
                    <Button variant="ghost" size="icon">
                        <Icons.Tools />
                    </Button>
                </ProjectTools>
                <ProjectSettings project={project}>
                    <Button variant="ghost" size="icon">
                        <Icons.Settings />
                    </Button>
                </ProjectSettings>
            </div>
        </div>
    );
}
