"use client";

import { Button } from "@itsrakesh/ui";
import { PaginationState } from "@tanstack/react-table";
import { useState } from "react";

import { Icons } from "@/assets/icons";
import { ErrorBox } from "@/components/ui/error-box";
import { Heading } from "@/components/ui/heading";
import { trpc } from "@/utils/trpc";
import { columns } from "./columns";
import { NewAssetDialog } from "./new-asset";
import { AssetsTable } from "./table";

interface AssetsProps extends React.HTMLAttributes<HTMLElement> {
    isWidget?: boolean;
    onAdd?: (url: string) => void;
}

export function Assets({ isWidget, onAdd, ...props }: Readonly<AssetsProps>) {
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const { data, isFetching, refetch, error } = trpc.getAllAssets.useQuery({
        pagination: {
            page: pageIndex + 1,
            limit: pageSize,
        },
    });

    return (
        <div className="space-y-8" {...props}>
            <div className="flex items-center justify-between">
                <Heading>My Assets</Heading>
                <NewAssetDialog>
                    <Button>
                        <Icons.Add className="mr-2 size-4" /> Upload
                    </Button>
                </NewAssetDialog>
            </div>
            {error ? (
                <ErrorBox title="Error" description={error.message} />
            ) : (
                <AssetsTable
                    isWidget={isWidget}
                    onAdd={onAdd}
                    columns={columns}
                    data={data?.data.assets ?? []}
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
