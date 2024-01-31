import { toast } from "@itsrakesh/ui";
import { PaginationState } from "@tanstack/react-table";
import { useState } from "react";

import type { IGhost } from "@publish-studio/core";

import { Images } from "@/assets/images";
import { constants } from "@/config/constants";
import { useEditor } from "@/hooks/use-editor";
import { trpc } from "@/utils/trpc";
import { ConnectionCard } from "../../connection-card";
import { ImportPostsBody } from "../import-dialog";
import { GhostConnectForm } from "./connect-form";
import { GhostEditForm } from "./edit-form";

export type TGhostStatus = (typeof constants.ghostStatus)[keyof typeof constants.ghostStatus];

interface GhostProps {
    data?: IGhost;
    isLoading: boolean;
}

export function Ghost({ data, isLoading }: Readonly<GhostProps>) {
    const [isOpen, setIsOpen] = useState(false);
    const [isImportOpen, setIsImportOpen] = useState(false);

    const {
        refetch: disconnect,
        isFetching: isDisconnecting,
        error: disconnectError,
    } = trpc.platforms.ghost.disconnect.useQuery(undefined, {
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
            name="Ghost"
            icon={Images.ghostLogo}
            iconClassName="bg-white"
            isLoading={isLoading || isDisconnecting}
            connected={data !== undefined}
            username={data?.api_url.split("/")[2]}
            profile_url={data?.api_url}
            editForm={
                <GhostEditForm
                    setIsOpen={setIsOpen}
                    status={data?.status ?? constants.ghostStatus.DRAFT}
                    api_url={data?.api_url ?? ""}
                />
            }
            connectForm={<GhostConnectForm setIsOpen={setIsOpen} />}
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

    const { data, isFetching, error } = trpc.platforms.ghost.getAllPosts.useQuery(
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
            const post = posts.find(post => post.id === id);
            if (!post || !editor) return;

            setImportingPost(id);

            await importPost({
                name: post.title,
                title: post.title,
                description: post.excerpt ?? undefined,
                body: {
                    html: post.html,
                },
                tags: {
                    ghost_tags: post.tags,
                },
                canonical_url: post.canonical_url ?? undefined,
                cover_image: post.feature_image ?? undefined,
                platforms: [
                    {
                        name: constants.user.platforms.GHOST,
                        id: post.id,
                        published_url: post.url,
                        status: constants.project.platformPublishStatuses.SUCCESS,
                    },
                ],
                published_at: new Date(post.published_at ?? Date.now()),
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
                id: post.id,
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
