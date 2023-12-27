"use client";

import { Button } from "@itsrakesh/ui";
import { useState } from "react";

import { Icons } from "@/assets/icons";
import { ErrorBox } from "@/components/ui/error-box";
import { Heading } from "@/components/ui/heading";
import { trpc } from "@/utils/trpc";
import { PaginationState } from "@tanstack/react-table";
import { columns } from "./columns";
import { NewFolderDialog } from "./new-folder";
import { FoldersTable } from "./table";

interface ProjectsProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Folders({ ...props }: ProjectsProps) {
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const { data, isFetching, refetch, error } = trpc.getAllFolders.useQuery({
        pagination: {
            page: pageIndex + 1,
            limit: pageSize,
        },
    });

    return (
        <div className="space-y-8" {...props}>
            <div className="flex items-center justify-between">
                <Heading>My Folders</Heading>
                <NewFolderDialog>
                    <Button>
                        <Icons.Add className="mr-2 size-4" /> New Folder
                    </Button>
                </NewFolderDialog>
            </div>
            {error ? (
                <ErrorBox title="Error" description={error.message} />
            ) : (
                <FoldersTable
                    columns={columns}
                    data={data?.data.folders ?? []}
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
