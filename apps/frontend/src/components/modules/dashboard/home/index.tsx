"use client";

import { Heading } from "@/components/ui/heading";
import { RecentFolders } from "./recent-folders";
import { RecentProjects } from "./recent-projects";

interface HomeProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Home({ ...props }: HomeProps) {
    return (
        <div className="space-y-8" {...props}>
            <Heading className="from-primary bg-gradient-to-r via-purple-500 to-blue-500 bg-clip-text text-center font-extrabold text-transparent">
                What would you like to write today?
            </Heading>
            <Heading level={2}>Recent</Heading>
            <RecentFolders />
            <RecentProjects />
        </div>
    );
}
