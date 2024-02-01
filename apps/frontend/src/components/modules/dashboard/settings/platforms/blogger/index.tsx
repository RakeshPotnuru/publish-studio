import { useEffect, useState } from "react";

import { toast } from "@itsrakesh/ui";
import type { IBlogger } from "@publish-studio/core";
import { Platform, PostStatus, ProjectStatus } from "@publish-studio/core/src/config/constants";

import { Images } from "@/assets/images";
import { useEditor } from "@/hooks/use-editor";
import { trpc } from "@/utils/trpc";

import { ConnectionCard } from "../../connection-card";
import { ImportPostsBodyWithoutPrevious } from "../import-dialog";
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
            await utils.platforms.getAll.invalidate();
            await utils.auth.getMe.invalidate();
        } catch {
            toast.error(disconnectError?.message ?? "Something went wrong.");
        }
    };

    return (
        <ConnectionCard
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
            staleTime: 60_000,
        },
    );

    useEffect(() => {
        if (data?.data.posts.nextPageToken) {
            setPageTokens([...pageTokens, data.data.posts.nextPageToken]);
        }
    }, [data?.data.posts.nextPageToken, pageTokens]);

    const posts = data?.data.posts.items ?? [];

    const { mutateAsync: createProject, isLoading: isCreatingProject } =
        trpc.projects.create.useMutation({
            onSuccess: () => {
                toast.success("Project created.");
            },
            onError: error => {
                toast.error(error.message);
            },
        });

    const { mutateAsync: createPost, isLoading: isCreatingPost } = trpc.post.create.useMutation({
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

            const { data } = await createProject({
                name: post.title,
                title: post.title,
                body: {
                    html: post.content,
                },
                tags: {
                    blogger_tags: post.labels,
                },
                platforms: [Platform.BLOGGER],
                published_at: new Date(post.published),
                status: ProjectStatus.PUBLISHED,
            });

            await createPost({
                platform: Platform.BLOGGER,
                post_id: post.id,
                project_id: data.project._id,
                published_at: new Date(post.published),
                published_url: post.url,
                status: PostStatus.SUCCESS,
            });

            setImportedPosts([...importedPosts, id]);
            setImportingPost(null);
        } catch {
            // Ignore
        }
    };

    const isLoading = isCreatingPost || isCreatingProject;

    return (
        <ImportPostsBodyWithoutPrevious
            posts={posts.map(post => ({
                id: post.id,
                title: post.title,
            }))}
            isFetching={isFetching}
            error={error?.message}
            setPagination={setPagination}
            cursors={pageTokens}
            pageSize={pageSize}
            end_cursor={page_token}
            isLoading={isLoading}
            importingPost={importingPost ?? undefined}
            importedPosts={importedPosts}
            handleImport={handleImport}
        />
    );
}
