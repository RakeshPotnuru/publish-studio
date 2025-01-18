"use client";

import { Heading } from "@/components/ui/heading";
import { ProText } from "@/components/ui/pro-text";

import { RecentFolders } from "./recent-folders";
import { RecentProjects } from "./recent-projects";
import { Stats } from "./stats";

export function Home() {
  return (
    <div className="space-y-8">
      <Heading className="text-center font-extrabold">
        <ProText>What will you write today?</ProText>
      </Heading>
      <Stats />
      <Heading level={2}>Recent</Heading>
      <RecentProjects />
      <RecentFolders />
    </div>
  );
}
