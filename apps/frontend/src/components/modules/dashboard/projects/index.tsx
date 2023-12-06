"use client";

import { Button } from "@itsrakesh/ui";

import { Icons } from "@/assets/icons";
import { ErrorBox } from "@/components/ui/error-box";
import { Heading } from "@/components/ui/heading";
import { IProject } from "@/lib/store/projects";
import { IPagination } from "@/types/common";
import { trpc } from "@/utils/trpc";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { columns } from "./columns";
import { NewProjectDialog } from "./new-project";
import { ProjectsTable } from "./table";

interface ProjectsProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Projects({ ...props }: ProjectsProps) {
    const [projects, setProjects] = useState<IProject[]>([]);
    const [pagination, setPagination] = useState<IPagination>();
    const [error, setError] = useState<string | null>(null);

    const searchParams = useSearchParams();

    const { mutateAsync: getAllProjects, isLoading } = trpc.getAllProjects.useMutation({
        onSuccess: ({ data }) => {
            setProjects(
                data.projects.map(project => ({
                    ...project,
                    created: project.created_at,
                    last_edited: project.updated_at,
                })),
            );
            setPagination(data.pagination);
        },
        onError: error => {
            setError(error.message);
        },
    });

    useEffect(() => {
        getAllProjects({
            pagination: {
                page: searchParams.get("page") ? parseInt(searchParams.get("page") as string) : 1,
                limit: searchParams.get("limit")
                    ? parseInt(searchParams.get("limit") as string)
                    : 10,
            },
        });
    }, [getAllProjects, searchParams]);

    return (
        <div className="space-y-8" {...props}>
            <div className="flex items-center justify-between">
                <Heading>My Projects</Heading>
                <NewProjectDialog>
                    <Button>
                        <Icons.Plus className="mr-2 h-4 w-4" /> New Project
                    </Button>
                </NewProjectDialog>
            </div>
            {error ? (
                <ErrorBox title="Error" description={error} />
            ) : (
                <ProjectsTable columns={columns} data={projects} />
            )}
        </div>
    );
}
