import type { Metadata } from "next";

import { Projects } from "@/components/modules/dashboard/projects";
import { DashboardShell } from "@/components/ui/shell";

export const metadata: Metadata = {
    title: "Projects",
    description: "Find your projects",
};

export default function ProjectsPage() {
    return (
        <DashboardShell>
            <Projects />
        </DashboardShell>
    );
}
