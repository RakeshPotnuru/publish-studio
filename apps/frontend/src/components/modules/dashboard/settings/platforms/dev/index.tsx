import { toast } from "@itsrakesh/ui";
import { PaginationState } from "@tanstack/react-table";
import { useState } from "react";

import type { IDevTo } from "@publish-studio/core";

import { Images } from "@/assets/images";
import { constants } from "@/config/constants";
import { useEditor } from "@/hooks/use-editor";
import { trpc } from "@/utils/trpc";
import { deserialize } from "../../../../../editor/transform-markdown";
import { ImportPostsBody } from "../import-dialog";
import { PlatformCard } from "../platform-card";
import { DevConnectForm } from "./connect-form";
import { DevEditForm } from "./edit-form";

interface DevToProps {
    data?: IDevTo;
    isLoading: boolean;
}

export function DevTo({ data, isLoading }: Readonly<DevToProps>) {
    const [isOpen, setIsOpen] = useState(false);
    const [isImportOpen, setIsImportOpen] = useState(false);

    const {
        refetch: disconnect,
        isFetching: isDisconnecting,
        error: disconnectError,
    } = trpc.platforms.devto.disconnect.useQuery(undefined, {
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
            name="Dev"
            icon={Images.devLogo}
            isLoading={isLoading || isDisconnecting}
            connected={data !== undefined}
            username={data?.username}
            profile_url={`https://dev.to/@${data?.username}`}
            editForm={
                <DevEditForm setIsOpen={setIsOpen} status={data?.status.toString() ?? "false"} />
            }
            connectForm={<DevConnectForm setIsOpen={setIsOpen} />}
            isImportOpen={isImportOpen}
            setIsImportOpen={setIsImportOpen}
            importComponent={<ImportPosts />}
        />
    );
}

export function ImportPosts() {
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [importedPosts, setImportedPosts] = useState<string[]>([]);
    const [importingPost, setImportingPost] = useState<string | null>(null);

    const { editor } = useEditor();

    const { data, isFetching, error } = trpc.platforms.devto.getAllPosts.useQuery(
        {
            pagination: { page: pageIndex + 1, limit: pageSize },
        },
        {
            staleTime: 60000,
        },
    );

    const posts = data?.data.posts ?? [];

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
            const post = posts.find(post => post.id.toString() === id);
            if (!post || !editor) return;

            setImportingPost(id);

            const json = deserialize(editor.schema, post.body_markdown);

            await importPost({
                name: post.title,
                title: post.title,
                description: post.description,
                body: {
                    json,
                },
                tags: {
                    devto_tags: post.tag_list,
                },
                canonical_url: post.canonical_url,
                cover_image: post.cover_image ?? undefined,
                platforms: [
                    {
                        name: constants.user.platforms.DEVTO,
                        id: post.id.toString(),
                        published_url: post.url,
                        status: constants.project.platformPublishStatuses.SUCCESS,
                    },
                ],
                published_at: new Date(post.published_at),
                status: constants.project.status.PUBLISHED,
            });

            setImportedPosts([...importedPosts, id]);
            setImportingPost(null);
        } catch (error) {}
    };

    return (
        <ImportPostsBody
            error={error?.message}
            isFetching={isFetching}
            posts={posts.map(post => ({
                id: post.id.toString(),
                title: post.title,
            }))}
            importedPosts={importedPosts}
            importingPost={importingPost ?? undefined}
            handleImport={handleImport}
            pageIndex={pageIndex}
            pageSize={pageSize}
            setPagination={setPagination}
            isLoading={isLoading}
        />
    );
}
