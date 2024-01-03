"use client";

import { Button } from "@itsrakesh/ui";
import { PaginationState } from "@tanstack/react-table";

import { Icons } from "@/assets/icons";
import { ErrorBox } from "@/components/ui/error-box";
import { Heading } from "@/components/ui/heading";
import { trpc } from "@/utils/trpc";
import { useState } from "react";
import { columns } from "./columns";
import { NewProjectDialog } from "./new-project";
import { ProjectsTable } from "./table";

interface ProjectsProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Projects({ ...props }: ProjectsProps) {
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const { data, isFetching, refetch, error } = trpc.getAllProjects.useQuery({
        pagination: {
            page: pageIndex + 1,
            limit: pageSize,
        },
    });

    return (
        <div className="space-y-8" {...props}>
            <div className="flex items-center justify-between">
                <Heading>My Projects</Heading>
                <NewProjectDialog>
                    <Button>
                        <Icons.Add className="mr-2 size-4" /> New Project
                    </Button>
                </NewProjectDialog>
            </div>
            {error ? (
                <div className="flex h-[70vh] items-center justify-center">
                    <ErrorBox title="Error" description={error.message} />
                </div>
            ) : (
                <ProjectsTable
                    columns={columns}
                    data={data?.data.projects ?? []}
                    refetch={refetch}
                    pageCount={data?.data.pagination.total_pages ?? 0}
                    pagination={{
                        pageIndex,
                        pageSize,
                    }}
                    setPagination={setPagination}
                    isLoading={isFetching}
                />
            )}
        </div>
    );
}
