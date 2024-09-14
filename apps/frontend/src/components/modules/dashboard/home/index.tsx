"use client";

import { Heading } from "@/components/ui/heading";
import { ProText } from "@/components/ui/pro-text";
import { DashboardShell } from "@/components/ui/shell";

import { RecentFolders } from "./recent-folders";
import { RecentProjects } from "./recent-projects";
import { Stats } from "./stats";

export function Home() {
  return (
    <DashboardShell>
      <Heading className="text-center font-extrabold">
        <ProText>What would you like to write today?</ProText>
      </Heading>
      <Stats />
      <Heading level={2}>Recent</Heading>
      <RecentProjects />
      <RecentFolders />
    </DashboardShell>
  );
}
