"use client";

import { useState } from "react";

import { Button, Skeleton } from "@itsrakesh/ui";
import type { PaginationState } from "@tanstack/react-table";
import mongoose from "mongoose";

import { Icons } from "@/assets/icons";
import { ErrorBox } from "@/components/ui/error-box";
import { Heading } from "@/components/ui/heading";
import { DashboardShell } from "@/components/ui/shell";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { trpc } from "@/utils/trpc";

import { columns } from "../projects/columns";
import { NewProject } from "../projects/new-project";
import { ProjectsTable } from "../projects/table";

export function Folder({ folderId }: Readonly<{ folderId: string }>) {
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const _folderId = new mongoose.Types.ObjectId(folderId);
  const { data, isFetching, error, refetch } =
    trpc.projects.getByFolderId.useQuery({
      pagination: {
        page: pageIndex + 1,
        limit: pageSize,
      },
      folder_id: _folderId,
    });

  useDocumentTitle(`Folders | ${data?.data.folder_name ?? "Not Found"}`);

  return (
    <DashboardShell>
      <div className="flex items-center justify-between">
        <Heading className="flex flex-row items-center">
          Folders <Icons.RightChevron />{" "}
          {isFetching ? (
            <Skeleton className="h-8 w-56" />
          ) : (
            data?.data.folder_name
          )}
        </Heading>
        <NewProject folderId={_folderId}>
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
    </DashboardShell>
  );
}
