"use client";

import { useState } from "react";

import { Button } from "@itsrakesh/ui";
import type { PaginationState } from "@tanstack/react-table";

import { Icons } from "@/assets/icons";
import { DashboardShell } from "@/components/ui/shell";
import { trpc } from "@/utils/trpc";

import { DashboardBody } from "../common/dashboard-body";
import { DashboardHeader } from "../common/dashboard-header";
import { columns } from "./columns";
import { NewFolderDialog } from "./new-folder";
import { FoldersTable } from "./table";

export function Folders() {
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isFetching, refetch, error } = trpc.folders.getAll.useQuery({
    pagination: {
      page: pageIndex + 1,
      limit: pageSize,
    },
  });

  return (
    <DashboardShell>
      <DashboardHeader
        title="My Folders"
        action={
          <NewFolderDialog>
            <Button>
              <Icons.Add className="mr-2 size-4" /> New Folder
            </Button>
          </NewFolderDialog>
        }
      />
      <DashboardBody error={error?.message}>
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
      </DashboardBody>
    </DashboardShell>
  );
}
