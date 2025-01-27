import { Button } from "@itsrakesh/ui";
import type { IProject } from "@publish-studio/core";

import { Icons } from "@/assets/icons";

import { PublishPost } from "../modules/dashboard/projects/publish-post";
import { ProjectSettings } from "../modules/dashboard/projects/settings";
import { ProjectTools } from "../modules/dashboard/projects/tools";
import type { MenuProps } from "./menu/fixed-menu";

interface ProjectToolbarProps extends MenuProps {
  project: IProject;
}

export function ProjectToolbar({
  project,
  editor,
}: Readonly<ProjectToolbarProps>) {
  return (
    <div className="flex flex-row justify-end space-x-1 bg-background p-2">
      <ProjectTools editor={editor} project={project}>
        <Button variant="ghost" size="icon" aria-label="Tools">
          <Icons.Tools />
        </Button>
      </ProjectTools>
      <ProjectSettings project={project}>
        <Button variant="ghost" size="icon" aria-label="Settings">
          <Icons.Settings />
        </Button>
      </ProjectSettings>
      <PublishPost editor={editor} project={project}>
        <Button variant="secondary">Publish</Button>
      </PublishPost>
    </div>
  );
}
