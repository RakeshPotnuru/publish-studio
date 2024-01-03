"use client";

import { Heading } from "@/components/ui/heading";
import { MagicText } from "@/components/ui/magic-text";
import { RecentFolders } from "./recent-folders";
import { RecentProjects } from "./recent-projects";
import { Stats } from "./stats";

interface HomeProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Home({ ...props }: HomeProps) {
    return (
        <div className="space-y-8" {...props}>
            <Heading className="text-center font-extrabold">
                <MagicText>What would you like to write today?</MagicText>
            </Heading>
            <Stats />
            <Heading level={2}>Recent</Heading>
            <RecentFolders />
            <RecentProjects />
        </div>
    );
}
