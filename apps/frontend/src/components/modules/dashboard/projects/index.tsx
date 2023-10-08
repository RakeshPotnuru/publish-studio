"use client";

import { Button } from "@itsrakesh/ui";

import { Heading } from "@/components/ui/heading";
import { generateProjects } from "@/data/faker";
import { columns } from "./columns";
import { ProjectsTable } from "./table";
import { Icons } from "@/components/ui/icons";

interface ProjectsProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Projects({ ...props }: ProjectsProps) {
    const data = generateProjects(14);

    return (
        <div className="space-y-8" {...props}>
            <div className="flex items-center justify-between">
                <Heading>My Projects</Heading>
                <Button>
                    <Icons.plus className="mr-1" /> New Project
                </Button>
            </div>
            <ProjectsTable columns={columns} data={data} />
        </div>
    );
}
