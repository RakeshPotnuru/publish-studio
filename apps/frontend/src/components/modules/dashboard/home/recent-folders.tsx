import { Button } from "@itsrakesh/ui";
import Link from "next/link";

import { Icons } from "@/assets/icons";
import { ErrorBox } from "@/components/ui/error-box";
import { Heading } from "@/components/ui/heading";
import { FoldersLoader } from "@/components/ui/loaders/folders-loader";
import { IFolder } from "@/lib/store/folders";
import { shortenText } from "@/utils/text-shortner";
import { trpc } from "@/utils/trpc";
import { useCallback, useEffect, useState } from "react";
import { NewFolderDialog } from "../folders/new-folder";

export function RecentFolders() {
    const [folders, setFolders] = useState<IFolder[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const { mutateAsync: getAllFolders } = trpc.getAllFolders.useMutation({
        onSuccess: ({ data }) => {
            setFolders(data.folders);
        },
        onError: error => {
            setError(error.message);
            setIsLoading(false);
        },
    });

    const fetchFolders = useCallback(
        async (page: number, limit: number) => {
            setIsLoading(true);
            await getAllFolders({
                pagination: {
                    page,
                    limit,
                },
            });
            setIsLoading(false);
        },
        [getAllFolders],
    );

    useEffect(() => {
        fetchFolders(1, 5);
    }, [fetchFolders]);

    return (
        <div className="space-y-4">
            <Heading level={3}>Folders</Heading>
            {isLoading ? (
                <FoldersLoader size="sm" count={6} />
            ) : error ? (
                <ErrorBox title="Error fetching folders" description={error} />
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
                                        <Icons.folder className="mr-2 h-4 w-4" />
                                        {shortenText(folder.name, 24)}
                                    </Link>
                                </Button>
                            ))}
                            <Button variant="outline" asChild>
                                <Link href="/folders">
                                    All folders <Icons.right className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </>
                    ) : (
                        <div className="col-span-4 space-y-4 p-4 text-center text-gray-500">
                            <p>No folders in sight. Create one to keep things neat and tidy!</p>
                            <NewFolderDialog>
                                <Button variant="secondary">
                                    <Icons.Plus className="mr-2 h-4 w-4" /> New Folder
                                </Button>
                            </NewFolderDialog>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
