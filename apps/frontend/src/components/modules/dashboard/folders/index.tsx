"use client";

import { Heading } from "@/components/ui/heading";

interface ProjectsProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Folders({ ...props }: ProjectsProps) {
    return (
        <div className="space-y-8" {...props}>
            <Heading>My Folders</Heading>
        </div>
    );
}
