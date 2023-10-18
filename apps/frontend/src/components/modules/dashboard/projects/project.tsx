"use client";

import { Button } from "@itsrakesh/ui";

import { Editor } from "@/components/editor";
import { Icons } from "@/components/ui/icons";
import { Sidebar } from "./sidebar";

interface ProjectProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Project({ ...props }: ProjectProps) {
    return (
        <div {...props}>
            <Editor />
            <Sidebar>
                <Button className="bg-background text-foreground absolute right-0 top-32 cursor-pointer rounded-none rounded-l-md px-1 py-2">
                    <Icons.chevronleft className="h-4 w-4" />
                </Button>
            </Sidebar>
        </div>
    );
}
