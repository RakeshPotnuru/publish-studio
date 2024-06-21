"use client";

import { useState } from "react";

import { Button } from "@itsrakesh/ui";
import type { PaginationState } from "@tanstack/react-table";

import { Icons } from "@/assets/icons";
import { trpc } from "@/utils/trpc";

import { DashboardBody } from "../common/dashboard-body";
import { DashboardHeader } from "../common/dashboard-header";
import { columns } from "./columns";
import type { TInsertImageOptions } from "./image-widget";
import { NewAssetDialog } from "./new-asset";
import { AssetsTable } from "./table";

interface AssetsProps extends React.HTMLAttributes<HTMLElement> {
  isWidget?: boolean;
  onImageInsert?: (options: TInsertImageOptions) => void;
}

export function Assets({
  isWidget,
  onImageInsert,
  ...props
}: Readonly<AssetsProps>) {
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isFetching, refetch, error } = trpc.assets.getAll.useQuery({
    pagination: {
      page: pageIndex + 1,
      limit: pageSize,
    },
  });

  return (
    <div className="space-y-8" {...props}>
      <DashboardHeader
        title="My Assets"
        action={
          <NewAssetDialog>
            <Button>
              <Icons.Add className="mr-2 size-4" /> Upload
            </Button>
          </NewAssetDialog>
        }
      />
      <DashboardBody error={error?.message}>
        <AssetsTable
          isWidget={isWidget}
          onImageInsert={onImageInsert}
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
      </DashboardBody>
    </div>
  );
}
