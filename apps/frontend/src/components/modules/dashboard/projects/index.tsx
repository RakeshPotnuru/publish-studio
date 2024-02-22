"use client";

import { useState } from "react";

import { Button } from "@itsrakesh/ui";
import type { PaginationState } from "@tanstack/react-table";

import { Icons } from "@/assets/icons";
import { ErrorBox } from "@/components/ui/error-box";
import { Heading } from "@/components/ui/heading";
import { trpc } from "@/utils/trpc";

import { columns } from "./columns";
import { NewProject } from "./new-project";
import { ProjectsTable } from "./table";

export function Projects() {
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isFetching, refetch, error } = trpc.projects.getAll.useQuery({
    pagination: {
      page: pageIndex + 1,
      limit: pageSize,
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Heading>My Projects</Heading>
        <NewProject>
          <Button>
            <Icons.Add className="mr-2 size-4" /> New Project
          </Button>
        </NewProject>
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
