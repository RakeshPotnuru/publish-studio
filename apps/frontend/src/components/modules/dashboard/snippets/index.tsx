"use client";

import { useEffect, useState } from "react";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  Skeleton,
} from "@itsrakesh/ui";
import type { PaginationState } from "@tanstack/react-table";

import { useSnippets } from "@/lib/stores/snippets";
import { trpc } from "@/utils/trpc";

import { DashboardBody } from "../common/dashboard-body";
import NewSnippet from "./new-snippet";
import SnippetBody from "./snippet-body";
import SnippetList from "./snippet-list";
import { SnippetNavigation } from "./snippet-navigation";

export default function Snippets() {
  const [{ pageIndex, pageSize }] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { setSnippets, setActiveSnippet } = useSnippets();

  const { data, isFetching, error } = trpc.snippets.getAll.useQuery({
    pagination: {
      limit: pageSize,
      page: pageIndex + 1,
    },
  });

  useEffect(() => {
    if (data) {
      setSnippets(data.data.snippets.snippets);
      setActiveSnippet(data.data.snippets.snippets[0]);
    }
  }, [data, setSnippets, setActiveSnippet]);

  return (
    <DashboardBody error={error?.message}>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={25} minSize={20}>
          <div className="divide-y">
            <div className="px-4 py-2">
              <NewSnippet isLoading={isFetching} />
            </div>
            {isFetching ? (
              <div className="space-y-2 p-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <Skeleton key={`skeleton-${i + 1}`} className="h-24" />
                ))}
              </div>
            ) : (
              <SnippetList />
            )}
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={75} minSize={50}>
          <div className="divide-y *:px-4">
            <SnippetNavigation isFetching={isFetching} />
            <div className="py-4">
              {isFetching ? <Skeleton className="h-screen" /> : <SnippetBody />}
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </DashboardBody>
  );
}
