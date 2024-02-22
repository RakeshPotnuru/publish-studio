"use client";

import { useState } from "react";

import type { PaginationState } from "@tanstack/react-table";

import { ErrorBox } from "@/components/ui/error-box";
import { Heading } from "@/components/ui/heading";
import { trpc } from "@/utils/trpc";

import { columns } from "./invites/columns";
import { InvitesTable } from "./invites/table";

export function Home() {
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, error, isFetching, refetch } =
    trpc.admin.invites.getAll.useQuery({
      pagination: {
        page: pageIndex + 1,
        limit: pageSize,
      },
    });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Heading>Invites</Heading>
      </div>
      {error ? (
        <div className="flex h-[70vh] items-center justify-center">
          <ErrorBox title="Error" description={error.message} />
        </div>
      ) : (
        <InvitesTable
          columns={columns}
          data={data?.data.invites ?? []}
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
