import { Button, Separator, Skeleton, toast } from "@itsrakesh/ui";
import { useEffect, useState } from "react";

import type { IHashnode } from "@publish-studio/core";

import { Images } from "@/assets/images";
import { Center } from "@/components/ui/center";
import { ErrorBox } from "@/components/ui/error-box";
import { ButtonLoader } from "@/components/ui/loaders/button-loader";
import { constants } from "@/config/constants";
import { useEditor } from "@/hooks/use-editor";
import { shortenText } from "@/utils/text-shortener";
import { trpc } from "@/utils/trpc";
import { deserialize } from "../../../../../editor/transform-markdown";
import { PlatformCard } from "../platform-card";
import { HashnodeConnectForm } from "./connect-form";
import { HashnodeEditForm } from "./edit-form";

interface HashnodeToProps {
    data?: IHashnode;
    isLoading: boolean;
}

export function Hashnode({ data, isLoading }: Readonly<HashnodeToProps>) {
    const [isOpen, setIsOpen] = useState(false);
    const [isImportOpen, setIsImportOpen] = useState(false);

    const {
        refetch: disconnect,
        isFetching: isDisconnecting,
        error: disconnectError,
    } = trpc.platforms.hashnode.disconnect.useQuery(undefined, {
        enabled: false,
    });

    const handleDisconnect = async () => {
        try {
            await disconnect();
        } catch (error) {
            toast.error(disconnectError?.message ?? "Something went wrong.");
        }
    };

    return (
        <PlatformCard
            onDisconnect={handleDisconnect}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            name="Hashnode"
            icon={Images.hashnodeLogo}
            isLoading={isLoading || isDisconnecting}
            connected={data !== undefined}
            username={data?.username}
            profile_url={`https://hashnode.com/@${data?.username}`}
            editForm={
                <HashnodeEditForm
                    setIsOpen={setIsOpen}
                    settings={{
                        delisted: data?.settings.delisted.toString() ?? "false",
                        enable_table_of_contents:
                            data?.settings.enable_table_of_contents.toString() ?? "false",
                        send_newsletter: data?.settings.send_newsletter.toString() ?? "false",
                    }}
                />
            }
            connectForm={<HashnodeConnectForm setIsOpen={setIsOpen} />}
            isImportOpen={isImportOpen}
            setIsImportOpen={setIsImportOpen}
            importComponent={<ImportPosts />}
        />
    );
}

export function ImportPosts() {
    const [{ pageSize, end_cursor }, setPagination] = useState<{
        pageSize: number;
        end_cursor?: string;
    }>({
        pageSize: 10,
    });
    const [importedPosts, setImportedPosts] = useState<string[]>([]);
    const [importingPost, setImportingPost] = useState<string | null>(null);
    const [cursors, setCursors] = useState<string[]>([]);

    const { editor } = useEditor();

    const { data, isFetching, error } = trpc.platforms.hashnode.getAllPosts.useQuery(
        {
            pagination: { limit: pageSize, end_cursor },
        },
        {
            staleTime: 60000,
        },
    );

    useEffect(() => {
        if (data?.data.posts.data.publication.posts.pageInfo.endCursor) {
            setCursors([...cursors, data.data.posts.data.publication.posts.pageInfo.endCursor]);
        }
    }, [data?.data.posts.data.publication.posts.pageInfo.endCursor, cursors]);

    const posts = data?.data.posts.data.publication.posts.edges ?? [];

    const { mutateAsync: importPost, isLoading } = trpc.projects.create.useMutation({
        onSuccess: () => {
            toast.success("Post imported successfully.");
        },
        onError: error => {
            toast.error(error.message);
        },
    });

    const handleImport = async (id: string) => {
        try {
            const post = posts.find(post => post.node.id === id)?.node;
            if (!post || !editor) return;

            setImportingPost(id);

            const json = deserialize(editor.schema, post.content.markdown);

            await importPost({
                name: post.title,
                title: post.seo.title ?? post.title,
                body: {
                    json,
                },
                platforms: [
                    {
                        name: constants.user.platforms.HASHNODE,
                        id: post.id,
                        published_url: post.url,
                        status: constants.project.platformPublishStatuses.SUCCESS,
                    },
                ],
                published_at: new Date(post.publishedAt),
                status: constants.project.status.PUBLISHED,
            });

            setImportedPosts([...importedPosts, id]);
            setImportingPost(null);
        } catch (error) {}
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2 rounded-lg border py-2">
                {error ? (
                    <Center>
                        <ErrorBox title="Failed to fetch posts" description={error.message} />
                    </Center>
                ) : isFetching ? (
                    Array.from({ length: 10 }).map((_, index) => (
                        <div key={`skeleton-${index + 1}`}>
                            <div className="flex items-center justify-between space-x-2 px-2">
                                <Skeleton className="h-8 w-3/4" />
                                <Skeleton className="h-8 w-3/12" />
                            </div>
                            {index !== 9 && <Separator className="mt-2" />}
                        </div>
                    ))
                ) : posts.length ? (
                    posts.map(post => (
                        <div key={post.node.id}>
                            <div className="flex items-center justify-between space-x-2 px-2">
                                <p title={post.node.title} className="text-sm">
                                    {posts.indexOf(post) +
                                        (cursors.indexOf(end_cursor ?? "") + 1) * pageSize +
                                        1}
                                    . {shortenText(post.node.title, 50)}
                                </p>
                                <Button
                                    onClick={() => handleImport(post.node.id)}
                                    variant={
                                        importedPosts.includes(post.node.id)
                                            ? "success"
                                            : "secondary"
                                    }
                                    size="sm"
                                    disabled={isLoading || importedPosts.includes(post.node.id)}
                                >
                                    {importedPosts.includes(post.node.id) ? (
                                        "Imported"
                                    ) : (
                                        <ButtonLoader
                                            isLoading={isLoading && importingPost === post.node.id}
                                        >
                                            Import
                                        </ButtonLoader>
                                    )}
                                </Button>
                            </div>
                            {posts.indexOf(post) !== posts.length - 1 && (
                                <Separator className="mt-2" />
                            )}
                        </div>
                    ))
                ) : (
                    <Center className="text-muted-foreground h-24">No results</Center>
                )}
            </div>
            <div className="flex justify-between">
                <Button
                    onClick={() =>
                        setPagination({
                            pageSize,
                            end_cursor: cursors[cursors.indexOf(end_cursor ?? "") - 1],
                        })
                    }
                    variant="outline"
                    disabled={isFetching || cursors.indexOf(end_cursor ?? "") === -1}
                >
                    Previous
                </Button>
                <Button
                    onClick={() =>
                        setPagination({
                            pageSize,
                            end_cursor: cursors[cursors.length - 1],
                        })
                    }
                    variant="outline"
                    disabled={posts.length === 0 || isFetching || posts.length < pageSize}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
