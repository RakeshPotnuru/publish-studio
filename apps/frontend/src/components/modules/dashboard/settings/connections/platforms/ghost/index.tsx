import { useState } from "react";

import { toast } from "@itsrakesh/ui";
import type { IGhost } from "@publish-studio/core";
import {
  GhostStatus,
  Platform,
  PostStatus,
  ProjectStatus,
} from "@publish-studio/core/src/config/constants";
import type { PaginationState } from "@tanstack/react-table";

import { Images } from "@/assets/images";
import { useEditor } from "@/hooks/use-editor";
import { trpc } from "@/utils/trpc";

import { ConnectionCard } from "../../connection-card";
import { ImportPostsBody } from "../import-dialog";
import { useResetUser } from "../use-reset-user";
import { GhostConnectForm } from "./connect-form";
import { GhostEditForm } from "./edit-form";

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
  const { resetUser } = useResetUser();

  const handleDisconnect = async () => {
    try {
      await disconnect();
      await utils.platforms.getAll.invalidate();
      await resetUser();
    } catch {
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
          status={data?.status ?? GhostStatus.DRAFT}
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
      staleTime: 60_000,
    },
  );

  const posts = data?.data.posts ?? [];

  const { mutateAsync: createProject, isLoading: isCreatingProject } =
    trpc.projects.create.useMutation({
      onSuccess: () => {
        toast.success("Project created.");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const { mutateAsync: createPost, isLoading: isCreatingPost } =
    trpc.post.create.useMutation({
      onSuccess: () => {
        toast.success("Post imported successfully.");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const handleImport = async (id: string) => {
    try {
      const post = posts.find((post) => post.id === id);
      if (!post || !editor) return;

      setImportingPost(id);

      const { data } = await createProject({
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
        platforms: [Platform.GHOST],
        published_at: new Date(post.published_at ?? Date.now()),
        status: ProjectStatus.PUBLISHED,
      });

      await createPost({
        platform: Platform.GHOST,
        post_id: post.id,
        project_id: data.project._id,
        published_at: new Date(post.published_at ?? Date.now()),
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
    <ImportPostsBody
      error={error?.message}
      isFetching={isFetching}
      posts={posts.map((post) => ({
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
