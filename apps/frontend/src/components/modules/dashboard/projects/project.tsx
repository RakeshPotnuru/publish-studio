"use client";

import { Button, Skeleton } from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";
import mongoose from "mongoose";
import Link from "next/link";
import { useParams } from "next/navigation";
import { forwardRef } from "react";

import { Icons } from "@/assets/icons";
import { Editor } from "@/components/modules/dashboard/projects/editor";
import { ErrorBox } from "@/components/ui/error-box";
import { siteConfig } from "@/config/site";
import { trpc } from "@/utils/trpc";

interface ProjectProps extends React.HTMLAttributes<HTMLDivElement> {}

export const SideButton = forwardRef<HTMLButtonElement, React.HTMLAttributes<HTMLButtonElement>>(
    ({ children, className, ...props }, ref) => {
        return (
            <Button
                ref={ref}
                className={cn(
                    "bg-background text-foreground fixed -right-10 top-40 -mr-2 -rotate-90 rounded-none rounded-t-md pt-1 transition-all duration-300 ease-in-out hover:mr-0",
                    className,
                )}
                {...props}
            >
                {children}
            </Button>
        );
    },
);
SideButton.displayName = "SideButton";

export function Project({ ...props }: ProjectProps) {
    const { projectId } = useParams();

    const { data, isFetching, error } = trpc.getProjectById.useQuery(
        new mongoose.Types.ObjectId(projectId.toString()),
    );

    const project = data && {
        ...data.data.project,
        created: data.data.project.created_at,
        last_edited: data.data.project.updated_at,
    };

    const projectView = isFetching ? (
        <div className="flex flex-row space-x-4">
            <div className="w-3/4 space-y-4">
                <Skeleton className="bg-background h-14 w-full rounded-full" />
                <Skeleton className="bg-background h-screen w-full rounded-3xl" />
            </div>
            <Skeleton className="bg-background h-screen w-1/4 rounded-3xl" />
        </div>
    ) : (
        project && <Editor project={project} />
    );

    return (
        <div {...props}>
            {error ? (
                <div className="flex h-[80vh] items-center justify-center">
                    <div className="bg-background flex w-max flex-col items-center space-y-4 rounded-lg p-10">
                        <ErrorBox title="Error" description={error.message} />
                        <Button variant="link" asChild>
                            <Link href={siteConfig.pages.dashboard.link}>
                                <Icons.Left className="mr-2 h-4 w-4" /> Back to Home
                            </Link>
                        </Button>
                    </div>
                </div>
            ) : (
                projectView
            )}
        </div>
    );
}
