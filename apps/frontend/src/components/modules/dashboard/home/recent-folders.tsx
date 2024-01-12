import { Button } from "@itsrakesh/ui";
import Link from "next/link";

import { Icons } from "@/assets/icons";
import { ErrorBox } from "@/components/ui/error-box";
import { Heading } from "@/components/ui/heading";
import { FoldersLoader } from "@/components/ui/loaders/folders-loader";
import { shortenText } from "@/utils/text-shortener";
import { trpc } from "@/utils/trpc";
import { NewFolderDialog } from "../folders/new-folder";

export function RecentFolders() {
    const { data, isFetching, error } = trpc.folders.getAll.useQuery({
        pagination: {
            page: 1,
            limit: 5,
        },
    });

    const folders = data?.data.folders ?? [];

    const foldersView = error ? (
        <div className="flex items-center justify-center">
            <ErrorBox title="Error fetching folders" description={error.message} />
        </div>
    ) : (
        <div className="grid grid-cols-4 gap-4 rounded-lg border p-4">
            {folders.length ? (
                <>
                    {folders.map(folder => (
                        <Button
                            key={folder._id.toString()}
                            title={folder.name}
                            variant="secondary"
                            className="flex justify-start"
                            asChild
                        >
                            <Link href={`/folders/${folder._id}`}>
                                <Icons.Folder className="mr-2 size-4" />
                                {shortenText(folder.name, 24)}
                            </Link>
                        </Button>
                    ))}
                    <Button variant="outline" asChild>
                        <Link href="/folders">
                            All folders <Icons.Right className="ml-2 size-4" />
                        </Link>
                    </Button>
                </>
            ) : (
                <div className="col-span-4 space-y-4 p-4 text-center text-gray-500">
                    <p>No folders in sight. Create one to keep things neat and tidy!</p>
                    <NewFolderDialog>
                        <Button variant="secondary">
                            <Icons.Add className="mr-2 size-4" /> New Folder
                        </Button>
                    </NewFolderDialog>
                </div>
            )}
        </div>
    );

    return (
        <div className="space-y-4">
            <Heading level={3}>Folders</Heading>
            {isFetching ? <FoldersLoader size="sm" count={6} /> : foldersView}
        </div>
    );
}
