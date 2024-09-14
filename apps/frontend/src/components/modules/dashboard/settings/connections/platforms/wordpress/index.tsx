import { useState } from "react";

import { toast } from "@itsrakesh/ui";
import type { IWordPress } from "@publish-studio/core";
import {
  Platform,
  PostStatus,
  ProjectStatus,
  WordPressStatus,
} from "@publish-studio/core/src/config/constants";
import type { PaginationState } from "@tanstack/react-table";
import readingTime from "reading-time";

import { Images } from "@/assets/images";
import { useEditor } from "@/components/modules/dashboard/projects/common/use-editor";
import { siteConfig } from "@/config/site";
import { trpc } from "@/utils/trpc";

import { ConnectionCard } from "../../connection-card";
import { ImportPostsBody } from "../import-dialog";
import { useResetUser } from "../use-reset-user";
import { WordPressConnectForm } from "./connect-form";
import { WordPressEditForm } from "./edit-form";

interface WordPressProps {
  data?: IWordPress;
  isLoading: boolean;
}

export function WordPress({ data, isLoading }: Readonly<WordPressProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);

  const {
    refetch: disconnect,
    isFetching: isDisconnecting,
    error: disconnectError,
  } = trpc.platforms.wordpress.disconnect.useQuery(undefined, {
    enabled: false,
  });

  const utils = trpc.useUtils();
  const { resetUser } = useResetUser();

  const handleDisconnect = async () => {
    try {
      await disconnect();
      await utils.platforms.getAll.invalidate();
      toast.success(
        "Platform disconnected successfully. Also, please disconnect from your connected accounts in your WordPress account.",
        {
          action: {
            label: "Open",
            onClick: () => {
              window.open(siteConfig.links.wordpressConnectedApps, "_blank");
            },
          },
        },
      );
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
      name="WordPress"
      icon={Images.wordpressLogo}
      iconClassName="bg-white"
      isLoading={isLoading || isDisconnecting}
      connected={data !== undefined}
      username={data?.blog_url.split("/")[2]}
      profile_url={data?.blog_url}
      editForm={
        <WordPressEditForm
          setIsOpen={setIsOpen}
          status={data?.status ?? WordPressStatus.DRAFT}
          publicize={data?.publicize.toString() ?? "false"}
        />
      }
      connectForm={<WordPressConnectForm />}
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

  const { data, isFetching, error } =
    trpc.platforms.wordpress.getAllPosts.useQuery(
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
      const post = posts.find((post) => post.ID.toString() === id);
      if (!post || !editor) return;

      setImportingPost(id);

      editor.commands.setContent(post.content);

      const { data } = await createProject({
        name: post.title,
        title: post.title,
        description: post.excerpt.replaceAll(/<[^>]*>/g, ""),
        body: {
          json: editor.getJSON() as JSON,
        },
        tags: {
          wordpress_tags: post.tags
            ? Object.values(post.tags).map((tag) => tag.name)
            : undefined,
        },
        cover_image: post.featured_image ?? undefined,
        platforms: [Platform.WORDPRESS],
        published_at: new Date(post.date),
        status: ProjectStatus.PUBLISHED,
        stats: {
          readingTime: readingTime(editor.getText()).time,
          wordCount: editor.storage.characterCount.words(),
        },
      });

      await createPost({
        platform: Platform.WORDPRESS,
        post_id: post.ID.toString(),
        project_id: data.project._id,
        published_at: new Date(post.date),
        published_url: post.URL,
        status: PostStatus.SUCCESS,
      });

      setImportedPosts([...importedPosts, id]);
      setImportingPost(null);
    } catch {
      // Ignore
    }
  };

  const isLoading = isCreatingProject || isCreatingPost;

  return (
    <ImportPostsBody
      error={error?.message}
      isFetching={isFetching}
      posts={posts.map((post) => ({
        id: post.ID.toString(),
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
