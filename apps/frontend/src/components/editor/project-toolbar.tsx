import { Button } from "@itsrakesh/ui";
import type { IProject } from "@publish-studio/core";

import { Icons } from "@/assets/icons";
import { shortenText } from "@/utils/text-shortener";

import { PublishPost } from "../modules/dashboard/projects/publish-post";
import { RenameProject } from "../modules/dashboard/projects/rename-project";
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
    <div className="flex justify-between bg-background p-2 py-[7px]">
      <div className="flex flex-row items-center rounded-full border px-2 py-0">
        <p title={project.name} className="text-sm">
          {shortenText(project.name, 20)}
        </p>
        <RenameProject project={project}>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-transparent hover:opacity-80"
            aria-label="Rename project"
          >
            <Icons.Edit />
          </Button>
        </RenameProject>
      </div>
      <div className="flex flex-row space-x-1">
        <PublishPost editor={editor} project={project}>
          <Button variant="secondary">Publish</Button>
        </PublishPost>
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
      </div>
    </div>
  );
}
