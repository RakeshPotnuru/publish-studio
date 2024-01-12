"use client";

import mongoose from "mongoose";
import { useParams } from "next/navigation";
import { useState } from "react";

import { Icons } from "@/assets/icons";
import { ErrorBox } from "@/components/ui/error-box";
import { Heading } from "@/components/ui/heading";
import { trpc } from "@/utils/trpc";
import { Button, Skeleton } from "@itsrakesh/ui";
import { PaginationState } from "@tanstack/react-table";
import { columns } from "../projects/columns";
import { NewProject } from "../projects/new-project";
import { ProjectsTable } from "../projects/table";

interface FolderProps extends React.HTMLAttributes<HTMLElement> {}

export function Folder({ ...props }: FolderProps) {
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const params = useParams();
    const folderId = new mongoose.Types.ObjectId(params.folderId.toString());

    const { data, isFetching, error, refetch } = trpc.projects.getByFolderId.useQuery({
        pagination: {
            page: pageIndex + 1,
            limit: pageSize,
        },
        folder_id: folderId,
    });

    return (
        <div className="space-y-8" {...props}>
            <div className="flex items-center justify-between">
                <Heading>
                    {isFetching ? <Skeleton className="h-8 w-56" /> : data?.data.folder_name}
                </Heading>
                <NewProject folderId={folderId}>
                    <Button>
                        <Icons.Add className="mr-2 size-4" /> New Project Here
                    </Button>
                </NewProject>
            </div>
            {error ? (
                <ErrorBox title="Error" description={error.message} />
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
