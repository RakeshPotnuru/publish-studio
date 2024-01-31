import Link from "next/link";

import { Button } from "@itsrakesh/ui";

import { Icons } from "@/assets/icons";
import { Center } from "@/components/ui/center";
import { ErrorBox } from "@/components/ui/error-box";
import { Heading } from "@/components/ui/heading";
import { FoldersLoader } from "@/components/ui/loaders/folders-loader";
import { shortenText } from "@/utils/text-shortener";
import { trpc } from "@/utils/trpc";

import { NewProject } from "../projects/new-project";

export function RecentProjects() {
    const { data, isFetching, error } = trpc.projects.getAll.useQuery({
        pagination: {
            page: 1,
            limit: 5,
        },
    });

    const projects = data?.data.projects ?? [];

    const projectsView = error ? (
        <Center>
            <ErrorBox title="Error fetching projects" description={error.message} />
        </Center>
    ) : (
        <div className="grid grid-cols-4 gap-4 rounded-lg border p-4">
            {projects.length > 0 ? (
                <>
                    {projects.slice(0, 5).map(project => (
                        <Button
                            key={project._id.toString()}
                            title={project.title}
                            variant="secondary"
                            className="flex justify-start"
                            asChild
                        >
                            <Link href={`/projects/${project._id}`}>
                                <Icons.Projects className="mr-2 size-4" />
                                {shortenText(project.name, 24)}
                            </Link>
                        </Button>
                    ))}
                    <Button variant="outline" asChild>
                        <Link href="/folders">
                            All projects <Icons.Right className="ml-2 size-4" />
                        </Link>
                    </Button>
                </>
            ) : (
                <div className="col-span-4 space-y-4 p-4 text-center text-gray-500">
                    <p>No projects yet. Ready to begin?</p>
                    <NewProject>
                        <Button variant="secondary">
                            <Icons.Add className="mr-2 size-4" /> New Project
                        </Button>
                    </NewProject>
                </div>
            )}
        </div>
    );

    return (
        <div className="space-y-4">
            <Heading level={3}>Projects</Heading>
            {isFetching ? <FoldersLoader size="sm" count={6} /> : projectsView}
        </div>
    );
}
