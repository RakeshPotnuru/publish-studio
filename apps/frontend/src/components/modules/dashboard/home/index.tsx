"use client";

import { Heading } from "@/components/ui/heading";
import { RecentFolders } from "./recent-folders";
import { RecentProjects } from "./recent-projects";

interface HomeProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Home({ ...props }: HomeProps) {
    return (
        <div className="space-y-8" {...props}>
            <Heading>Recent</Heading>
            <RecentFolders />
            <RecentProjects />
        </div>
    );
}
