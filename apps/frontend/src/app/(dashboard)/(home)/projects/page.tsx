import type { Metadata } from "next";

import { Projects } from "@/components/modules/dashboard/projects";

export const metadata: Metadata = {
    title: "Projects",
    description: "Find your projects",
};

export default function ProjectsPage() {
    return <Projects />;
}
