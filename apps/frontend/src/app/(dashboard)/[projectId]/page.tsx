import type { Metadata } from "next";

import { Project } from "@/components/modules/dashboard/projects/project";

export const metadata: Metadata = {
    title: "Project Name",
};

export default function ProjectPage() {
    return (
        <div>
            <Project />
        </div>
    );
}
