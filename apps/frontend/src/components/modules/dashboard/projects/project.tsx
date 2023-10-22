"use client";

import { Button } from "@itsrakesh/ui";

import { Editor } from "@/components/editor";
import { PublishPost } from "./publish-post";

interface ProjectProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Project({ ...props }: ProjectProps) {
    return (
        <div {...props}>
            <Editor />
            <PublishPost>
                <Button className="bg-background text-foreground fixed -right-10 top-40 -mr-2 -rotate-90 rounded-none rounded-t-md pt-1">
                    Publish Post
                </Button>
            </PublishPost>
        </div>
    );
}
