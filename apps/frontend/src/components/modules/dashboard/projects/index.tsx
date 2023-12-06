"use client";

import { Button } from "@itsrakesh/ui";

import { Icons } from "@/assets/icons";
import { ErrorBox } from "@/components/ui/error-box";
import { Heading } from "@/components/ui/heading";
import { IProject } from "@/lib/store/projects";
import { IPagination } from "@/types/common";
import { trpc } from "@/utils/trpc";
import { useCallback, useState } from "react";
import { columns } from "./columns";
import { NewProjectDialog } from "./new-project";
import { ProjectsTable } from "./table";

interface ProjectsProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Projects({ ...props }: ProjectsProps) {
    const [projects, setProjects] = useState<IProject[]>([]);
    const [pagination, setPagination] = useState<IPagination>({
        page: 0,
        limit: 10,
        total_pages: 0,
        total_rows: 0,
    });
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const { mutateAsync: getAllProjects } = trpc.getAllProjects.useMutation({
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
            setIsLoading(false);
        },
    });

    const fetchProjects = useCallback(
        async (page: number, limit: number) => {
            setIsLoading(true);
            await getAllProjects({
                pagination: {
                    page,
                    limit,
                },
            });
            setIsLoading(false);
        },
        [getAllProjects],
    );

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
                <ProjectsTable
                    columns={columns}
                    data={projects}
                    fetchProjects={fetchProjects}
                    paginationData={pagination}
                    isLoading={isLoading}
                />
            )}
        </div>
    );
}
