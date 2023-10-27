"use client";

import { Button } from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";
import { forwardRef } from "react";

import { Editor } from "@/components/editor";
import { PublishPost } from "./publish-post";
import { ProjectTools } from "./tools";

interface ProjectProps extends React.HTMLAttributes<HTMLDivElement> {}

const SideButton = forwardRef<HTMLButtonElement, React.HTMLAttributes<HTMLButtonElement>>(
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
    return (
        <div {...props}>
            <Editor />
            <PublishPost>
                <SideButton>Publish Post</SideButton>
            </PublishPost>
            <ProjectTools>
                <SideButton className="right-0 top-64 -mr-6 hover:-mr-4">Tools</SideButton>
            </ProjectTools>
        </div>
    );
}
