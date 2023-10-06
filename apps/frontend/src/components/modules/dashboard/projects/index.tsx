"use client";

import { Heading } from "@/components/ui/heading";
import { ProjectsTable } from "./table";
import { generateProjects } from "@/data/faker";
import { columns } from "./columns";

interface ProjectsProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Projects({ ...props }: ProjectsProps) {
    const data = generateProjects(14);

    return (
        <div className="space-y-8" {...props}>
            <Heading>My Projects</Heading>
            <ProjectsTable columns={columns} data={data} />
        </div>
    );
}
