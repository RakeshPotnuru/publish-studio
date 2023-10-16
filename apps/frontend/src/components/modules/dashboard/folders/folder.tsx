"use client";

import { useParams } from "next/navigation";

import { Heading } from "@/components/ui/heading";
import data from "@/data/projects.json";
import { columns } from "../projects/columns";
import { ProjectsTable } from "../projects/table";

interface FolderProps extends React.HTMLAttributes<HTMLElement> {}

export function Folder({ ...props }: FolderProps) {
    const { folderId } = useParams();

    return (
        <div className="space-y-8" {...props}>
            <Heading>{folderId}</Heading>
            {/* TODO: remove slice */}
            <ProjectsTable columns={columns} data={data.slice(0, 5)} />
        </div>
    );
}
