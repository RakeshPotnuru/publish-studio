import { Button } from "@itsrakesh/ui";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { Icons } from "@/assets/icons";
import { ErrorBox } from "@/components/ui/error-box";
import { Heading } from "@/components/ui/heading";
import { FoldersLoader } from "@/components/ui/loaders/folders-loader";
import { IProject } from "@/lib/store/projects";
import { IPagination } from "@/types/common";
import { shortenText } from "@/utils/text-shortner";
import { trpc } from "@/utils/trpc";
import { NewProjectDialog } from "../projects/new-project";

export function RecentProjects() {
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

    useEffect(() => {
        fetchProjects(1, 5);
    }, [fetchProjects]);

    return (
        <div className="space-y-4">
            <Heading level={3}>Projects</Heading>
            {isLoading ? (
                <FoldersLoader size="sm" count={6} />
            ) : error ? (
                <ErrorBox title="Error fetching projects" description={error} />
            ) : (
                <div className="grid grid-cols-4 gap-4 rounded-lg border p-4">
                    {projects.length ? (
                        <>
                            {projects.slice(0, 5).map(project => (
                                <Button
                                    key={project._id.toString()}
                                    title={project.title}
                                    variant="secondary"
                                    className="flex justify-start"
                                    asChild
                                >
                                    <Link href={`/projects/${project._id}`}>
                                        <Icons.projects className="mr-2 h-4 w-4" />
                                        {shortenText(project.title, 24)}
                                    </Link>
                                </Button>
                            ))}
                            <Button variant="outline" asChild>
                                <Link href="/folders">
                                    All projects <Icons.right className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </>
                    ) : (
                        <div className="col-span-4 space-y-4 p-4 text-center text-gray-500">
                            <p>No projects yet. Ready to begin?</p>
                            <NewProjectDialog>
                                <Button variant="secondary">
                                    <Icons.Plus className="mr-2 h-4 w-4" /> New Project
                                </Button>
                            </NewProjectDialog>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
