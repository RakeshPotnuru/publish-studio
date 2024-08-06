import { useState } from "react";

import { toast } from "@itsrakesh/ui";
import type { IDevTo } from "@publish-studio/core";
import {
  Platform,
  PostStatus,
  ProjectStatus,
} from "@publish-studio/core/src/config/constants";
import type { PaginationState } from "@tanstack/react-table";
import readingTime from "reading-time";

import { Images } from "@/assets/images";
import { useEditor } from "@/hooks/use-editor";
import { trpc } from "@/utils/trpc";

import { ConnectionCard } from "../../connection-card";
import { ImportPostsBody } from "../import-dialog";
import { useResetUser } from "../use-reset-user";
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
      name="Dev"
      icon={Images.devLogo}
      isLoading={isLoading || isDisconnecting}
      connected={data !== undefined}
      username={data?.username}
      profile_url={data && `https://dev.to/@${data.username}`}
      editForm={
        <DevEditForm
          setIsOpen={setIsOpen}
          status={data?.status.toString() ?? "false"}
        />
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
      const post = posts.find((post) => post.id.toString() === id);
      if (!post || !editor) return;

      setImportingPost(id);

      editor.commands.setContent(post.body_markdown);

      const { data } = await createProject({
        name: post.title,
        title: post.title,
        description: post.description,
        body: {
          json: editor.getJSON() as JSON,
        },
        tags: {
          devto_tags: post.tag_list,
        },
        canonical_url: post.canonical_url,
        cover_image: post.cover_image ?? undefined,
        platforms: [Platform.DEVTO],
        published_at: new Date(post.published_at),
        status: ProjectStatus.PUBLISHED,
        stats: {
          readingTime: readingTime(editor.getText()).time,
          wordCount: editor.storage.characterCount.words(),
        },
      });

      await createPost({
        platform: Platform.DEVTO,
        post_id: post.id.toString(),
        project_id: data.project._id,
        published_at: new Date(post.published_at),
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
