"use client";

import { Editor } from "@/components/editor";
import { DashboardShell } from "@/components/ui/shell";

interface ProjectProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Project({ ...props }: ProjectProps) {
    return (
        <div className="flex flex-row space-x-4" {...props}>
            <div className="w-3/4">
                <Editor />
            </div>
            <DashboardShell className="sticky top-4 h-max w-1/4"></DashboardShell>
        </div>
    );
}
