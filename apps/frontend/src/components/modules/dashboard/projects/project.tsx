"use client";

import { Editor } from "@/components/editor";

interface ProjectProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Project({ ...props }: ProjectProps) {
    return (
        <div {...props}>
            <Editor />
        </div>
    );
}