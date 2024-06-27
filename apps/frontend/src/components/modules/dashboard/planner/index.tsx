"use client";

import { useEffect } from "react";

import { Skeleton } from "@itsrakesh/ui";

import { DashboardShell } from "@/components/ui/shell";
import usePlannerStore from "@/lib/store/planner";
import { trpc } from "@/utils/trpc";

import { DashboardBody } from "../common/dashboard-body";
import { DashboardHeader } from "../common/dashboard-header";
import { Brainstorm } from "./brainstorm";
import { Sections } from "./sections";

export function Planner() {
  const { data, error, isFetching } = trpc.section.getAll.useQuery();

  const { setSections } = usePlannerStore();

  useEffect(() => {
    if (data) {
      setSections(() => [...data]);
    }
  }, [data, setSections]);

  return (
    <DashboardShell>
      <DashboardHeader title="Planner" action={<Brainstorm />} />
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
          <Sections />
        )}
      </DashboardBody>
    </DashboardShell>
  );
}
