"use client";

import { Button } from "@itsrakesh/ui";
import { useCallback, useState } from "react";

import { Icons } from "@/assets/icons";
import { ErrorBox } from "@/components/ui/error-box";
import { Heading } from "@/components/ui/heading";
import { IFolder } from "@/lib/store/folders";
import { IPagination } from "@/types/common";
import { trpc } from "@/utils/trpc";
import { columns } from "./columns";
import { NewFolderDialog } from "./new-folder";
import { FoldersTable } from "./table";

interface ProjectsProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Folders({ ...props }: ProjectsProps) {
    const [folders, setFolders] = useState<IFolder[]>([]);
    const [pagination, setPagination] = useState<IPagination>({
        page: 0,
        limit: 10,
        total_pages: 0,
        total_rows: 0,
    });
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const { mutateAsync: getAllFolders } = trpc.getAllFolders.useMutation({
        onSuccess: ({ data }) => {
            setFolders(data.folders);
            setPagination(data.pagination);
        },
        onError: error => {
            setError(error.message);
            setIsLoading(false);
        },
    });

    const fetchFolders = useCallback(
        async (page: number, limit: number) => {
            setIsLoading(true);
            await getAllFolders({
                pagination: {
                    page,
                    limit,
                },
            });
            setIsLoading(false);
        },
        [getAllFolders],
    );

    return (
        <div className="space-y-8" {...props}>
            <div className="flex items-center justify-between">
                <Heading>My Folders</Heading>
                <NewFolderDialog>
                    <Button>
                        <Icons.Plus className="mr-2 h-4 w-4" /> New Folder
                    </Button>
                </NewFolderDialog>
            </div>
            {error ? (
                <ErrorBox title="Error" description={error} />
            ) : (
                <FoldersTable
                    columns={columns}
                    data={folders}
                    fetchFolders={fetchFolders}
                    paginationData={pagination}
                    isLoading={isLoading}
                />
            )}
        </div>
    );
}
