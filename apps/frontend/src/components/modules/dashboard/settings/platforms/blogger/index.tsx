import { Button, Separator, Skeleton, toast } from "@itsrakesh/ui";
import { useEffect, useState } from "react";

import type { IBlogger } from "@publish-studio/core";

import { Images } from "@/assets/images";
import { Center } from "@/components/ui/center";
import { ErrorBox } from "@/components/ui/error-box";
import { ButtonLoader } from "@/components/ui/loaders/button-loader";
import { constants } from "@/config/constants";
import { useEditor } from "@/hooks/use-editor";
import { shortenText } from "@/utils/text-shortener";
import { trpc } from "@/utils/trpc";
import { PlatformCard } from "../platform-card";
import { BloggerConnectForm } from "./connect-form";
import { BloggerEditForm } from "./edit-form";

interface BloggerProps {
    data?: IBlogger;
    isLoading: boolean;
}

export function Blogger({ data, isLoading }: Readonly<BloggerProps>) {
    const [isOpen, setIsOpen] = useState(false);
    const [isImportOpen, setIsImportOpen] = useState(false);

    const {
        refetch: disconnect,
        isFetching: isDisconnecting,
        error: disconnectError,
    } = trpc.platforms.blogger.disconnect.useQuery(undefined, {
        enabled: false,
    });
    const utils = trpc.useUtils();

    const handleDisconnect = async () => {
        try {
            await disconnect();
            utils.platforms.getAll.invalidate();
        } catch (error) {
            toast.error(disconnectError?.message ?? "Something went wrong.");
        }
    };

    return (
        <PlatformCard
            onDisconnect={handleDisconnect}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            name="Blogger"
            icon={Images.bloggerLogo}
            isLoading={isLoading || isDisconnecting}
            connected={data !== undefined}
            username={data?.blog_url.split("/")[2]}
            profile_url={data?.blog_url}
            editForm={
                <BloggerEditForm
                    setIsOpen={setIsOpen}
                    blog_id={data?.blog_id ?? ""}
                    blog_url={data?.blog_url ?? ""}
                    status={data?.status.toString() ?? "false"}
                />
            }
            connectForm={<BloggerConnectForm />}
            isImportOpen={isImportOpen}
            setIsImportOpen={setIsImportOpen}
            importComponent={<ImportPosts />}
        />
    );
}

export function ImportPosts() {
    const [{ pageSize, page_token }, setPagination] = useState<{
        pageSize: number;
        page_token?: string;
    }>({
        pageSize: 10,
    });
    const [importedPosts, setImportedPosts] = useState<string[]>([]);
    const [importingPost, setImportingPost] = useState<string | null>(null);
    const [pageTokens, setPageTokens] = useState<string[]>([]);

    const { editor } = useEditor();

    const { data, isFetching, error } = trpc.platforms.blogger.getAllPosts.useQuery(
        {
            pagination: { limit: pageSize, page_token },
        },
        {
            staleTime: 60000,
        },
    );

    useEffect(() => {
        if (data?.data.posts.nextPageToken) {
            setPageTokens([...pageTokens, data.data.posts.nextPageToken]);
        }
    }, [data?.data.posts.nextPageToken, pageTokens]);

    const posts = data?.data.posts.items ?? [];

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
            const post = posts.find(post => post.id === id);
            if (!post || !editor) return;

            setImportingPost(id);

            await importPost({
                name: post.title,
                title: post.title,
                body: {
                    html: post.content,
                },
                tags: {
                    blogger_tags: post.labels,
                },
                platforms: [
                    {
                        name: constants.user.platforms.BLOGGER,
                        id: post.id,
                        published_url: post.url,
                        status: constants.project.platformPublishStatuses.SUCCESS,
                    },
                ],
                published_at: new Date(post.published),
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
                        <div key={post.id}>
                            <div className="flex items-center justify-between space-x-2 px-2">
                                <p title={post.title} className="text-sm">
                                    {posts.indexOf(post) +
                                        (pageTokens.indexOf(page_token ?? "") + 1) * pageSize +
                                        1}
                                    . {shortenText(post.title, 50)}
                                </p>
                                <Button
                                    onClick={() => handleImport(post.id)}
                                    variant={
                                        importedPosts.includes(post.id) ? "success" : "secondary"
                                    }
                                    size="sm"
                                    disabled={isLoading || importedPosts.includes(post.id)}
                                >
                                    {importedPosts.includes(post.id) ? (
                                        "Imported"
                                    ) : (
                                        <ButtonLoader
                                            isLoading={isLoading && importingPost === post.id}
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
                            page_token: pageTokens[pageTokens.indexOf(page_token ?? "") - 1],
                        })
                    }
                    variant="outline"
                    disabled={isFetching || pageTokens.indexOf(page_token ?? "") === -1}
                >
                    Previous
                </Button>
                <Button
                    onClick={() =>
                        setPagination({
                            pageSize,
                            page_token: pageTokens[pageTokens.length - 1],
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
