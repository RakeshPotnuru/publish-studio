import { toast } from "@itsrakesh/ui";
import { useEffect, useState } from "react";

import type { IHashnode } from "@publish-studio/core";

import { Images } from "@/assets/images";
import { constants } from "@/config/constants";
import { useEditor } from "@/hooks/use-editor";
import { trpc } from "@/utils/trpc";
import { deserialize } from "../../../../../editor/transform-markdown";
import { ConnectionCard } from "../../connection-card";
import { ImportPostsBodyWithoutPrevious } from "../import-dialog";
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
    const utils = trpc.useUtils();

    const handleDisconnect = async () => {
        try {
            await disconnect();
            utils.platforms.getAll.invalidate();
            utils.auth.getMe.invalidate();
        } catch (error) {
            toast.error(disconnectError?.message ?? "Something went wrong.");
        }
    };

    return (
        <ConnectionCard
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
            setCursors(prevCursors => [
                ...prevCursors,
                data.data.posts.data.publication.posts.pageInfo.endCursor,
            ]);
        }
    }, [data?.data.posts.data.publication.posts.pageInfo.endCursor]);

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
        <ImportPostsBodyWithoutPrevious
            posts={posts.map(post => ({
                id: post.node.id,
                title: post.node.title,
            }))}
            isFetching={isFetching}
            error={error?.message}
            setPagination={setPagination}
            cursors={cursors}
            pageSize={pageSize}
            end_cursor={end_cursor}
            isLoading={isLoading}
            importingPost={importingPost ?? undefined}
            importedPosts={importedPosts}
            handleImport={handleImport}
        />
    );
}
