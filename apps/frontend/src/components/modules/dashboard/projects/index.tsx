"use client";

import { Button } from "@itsrakesh/ui";

import { Heading } from "@/components/ui/heading";
import { Icons } from "@/components/ui/icons";
import data from "@/data/projects.json";
import { columns } from "./columns";
import { NewProjectDialog } from "./new-project";
import { ProjectsTable } from "./table";

interface ProjectsProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Projects({ ...props }: ProjectsProps) {
    return (
        <div className="space-y-8" {...props}>
            <div className="flex items-center justify-between">
                <Heading>My Projects</Heading>
                <NewProjectDialog>
                    <Button>
                        <Icons.plus className="mr-2 h-4 w-4" /> New Project
                    </Button>
                </NewProjectDialog>
            </div>
            <ProjectsTable columns={columns} data={data} />
        </div>
    );
}
