"use client";

import { forwardRef } from "react";
import Link from "next/link";

import { Button, Skeleton } from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";
import mongoose from "mongoose";

import { Icons } from "@/assets/icons";
import { Editor } from "@/components/editor";
import { ErrorBox } from "@/components/ui/error-box";
import { siteConfig } from "@/config/site";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { trpc } from "@/utils/trpc";

export const SideButton = forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement>
>(({ children, className, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      className={cn(
        "fixed -right-10 top-40 -mr-2 -rotate-90 rounded-none rounded-t-md bg-background pt-1 text-foreground transition-all duration-300 ease-in-out hover:mr-0",
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  );
});
SideButton.displayName = "SideButton";

export function Project({ projectId }: { projectId: string }) {
  const { data, isFetching, error } = trpc.projects.getById.useQuery(
    new mongoose.Types.ObjectId(projectId.toString()),
    { keepPreviousData: true },
  );

  const project = data && {
    ...data.data.project,
    created: data.data.project.created_at,
    last_edited: data.data.project.updated_at,
  };

  const title = isFetching ? "Loading..." : project?.name ?? "Not Found";

  useDocumentTitle(`Projects | ${title}`);

  const projectView = isFetching ? (
    <div className="flex flex-row">
      <div className="w-3/4 *:rounded-none *:bg-background">
        <Skeleton className="h-14 border-b border-r" />
        <Skeleton className="h-screen border-r" />
      </div>
      <div className="flex w-1/4 flex-col *:rounded-none *:bg-background">
        <Skeleton className="h-14 border-b" />
        <Skeleton className="h-screen" />
      </div>
    </div>
  ) : (
    project && <Editor project={project} />
  );

  return error ? (
    <div className="flex h-[80vh] items-center justify-center">
      <div className="flex w-max flex-col items-center space-y-4 rounded-lg bg-background p-10">
        <ErrorBox title="Error" description={error.message} />
        <Button variant="link" asChild>
          <Link href={siteConfig.pages.dashboard.link}>
            <Icons.Left className="mr-2 size-4" /> Back to Home
          </Link>
        </Button>
      </div>
    </div>
  ) : (
    projectView
  );
}
