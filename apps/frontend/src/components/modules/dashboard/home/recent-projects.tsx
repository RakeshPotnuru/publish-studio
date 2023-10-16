import { Button } from "@itsrakesh/ui";
import Link from "next/link";

import { Heading } from "@/components/ui/heading";
import { Icons } from "@/components/ui/icons";
import projects from "@/data/projects.json";
import { shortenText } from "@/lib/text-shortner";

export function RecentProjects() {
    return (
        <div className="space-y-4">
            <Heading level={3}>Projects</Heading>
            <div className="grid grid-cols-4 gap-4">
                {projects.slice(0, 5).map(project => (
                    <Button
                        key={project._id}
                        title={project.title}
                        variant="secondary"
                        className="flex justify-start"
                        asChild
                    >
                        <Link href={`/projects/${project._id}`}>
                            <Icons.projects className="mr-2 h-4 w-4" />
                            {shortenText(project.title, 24)}
                        </Link>
                    </Button>
                ))}
                <Button variant="outline" asChild>
                    <Link href="/folders">
                        All projects <Icons.right className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </div>
        </div>
    );
}
