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
import { NewProject } from "./new-project";
import { ProjectsTable } from "./table";

export function Projects() {
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isFetching, refetch, error } = trpc.projects.getAll.useQuery(
    {
      pagination: {
        limit: pageSize,
        page: pageIndex + 1,
      },
    },
    { enabled: false },
  );

  return (
    <DashboardShell>
      <DashboardHeader
        title="Projects"
        action={
          <NewProject>
            <Button>
              <Icons.Add className="mr-2 size-4" /> New Project
            </Button>
          </NewProject>
        }
      />
      <DashboardBody error={error?.message}>
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
      </DashboardBody>
    </DashboardShell>
  );
}
