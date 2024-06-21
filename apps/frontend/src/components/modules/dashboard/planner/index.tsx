"use client";

import { Skeleton } from "@itsrakesh/ui";

import { DashboardShell } from "@/components/ui/shell";
import { trpc } from "@/utils/trpc";

import { DashboardBody } from "../common/dashboard-body";
import { DashboardHeader } from "../common/dashboard-header";
import { Sections } from "./section";

export function Planner() {
  const { data, error, isFetching } = trpc.section.getAll.useQuery();

  return (
    <DashboardShell>
      <DashboardHeader title="My Planner" />
      <DashboardBody error={error?.message}>
        {isFetching ? (
          <div className="flex flex-row gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton
                key={`skeleton${i + 1}`}
                className="h-[72vh] w-72 rounded-xl"
              />
            ))}
          </div>
        ) : (
          <Sections data={data} />
        )}
      </DashboardBody>
    </DashboardShell>
  );
}
