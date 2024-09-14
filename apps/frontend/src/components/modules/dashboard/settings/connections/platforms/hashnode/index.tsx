import { useEffect, useState } from "react";

import { toast } from "@itsrakesh/ui";
import type { IHashnode } from "@publish-studio/core";
import {
  Platform,
  PostStatus,
  ProjectStatus,
} from "@publish-studio/core/src/config/constants";
import readingTime from "reading-time";

import { Images } from "@/assets/images";
import { useEditor } from "@/components/modules/dashboard/projects/common/use-editor";
import { trpc } from "@/utils/trpc";

import { ConnectionCard } from "../../connection-card";
import { ImportPostsBodyWithoutPrevious } from "../import-dialog";
import { useResetUser } from "../use-reset-user";
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
      name="Hashnode"
      icon={Images.hashnodeLogo}
      isLoading={isLoading || isDisconnecting}
      connected={data !== undefined}
      username={data?.username}
      profile_url={data && `https://hashnode.com/@${data.username}`}
      editForm={
        <HashnodeEditForm
          setIsOpen={setIsOpen}
          settings={{
            delisted: data?.settings.delisted.toString() ?? "false",
            enable_table_of_contents:
              data?.settings.enable_table_of_contents.toString() ?? "false",
            send_newsletter:
              data?.settings.send_newsletter.toString() ?? "false",
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

  const { data, isFetching, error } =
    trpc.platforms.hashnode.getAllPosts.useQuery(
      {
        pagination: { limit: pageSize, end_cursor },
      },
      {
        staleTime: 60_000,
      },
    );

  useEffect(() => {
    if (data?.data.posts.data.publication.posts.pageInfo.endCursor) {
      setCursors((prevCursors) => [
        ...prevCursors,
        data.data.posts.data.publication.posts.pageInfo.endCursor,
      ]);
    }
  }, [data?.data.posts.data.publication.posts.pageInfo.endCursor]);

  const posts = data?.data.posts.data.publication.posts.edges ?? [];

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
      const post = posts.find((post) => post.node.id === id)?.node;
      if (!post || !editor) return;

      setImportingPost(id);

      editor.commands.setContent(post.content.markdown);

      const { data } = await createProject({
        name: post.title,
        title: post.seo.title ?? post.title,
        body: {
          json: editor.getJSON() as JSON,
        },
        platforms: [Platform.HASHNODE],
        published_at: new Date(post.publishedAt),
        status: ProjectStatus.PUBLISHED,
        stats: {
          readingTime: readingTime(editor.getText()).time,
          wordCount: editor.storage.characterCount.words(),
        },
      });

      await createPost({
        platform: Platform.HASHNODE,
        post_id: post.id,
        project_id: data.project._id,
        published_at: new Date(post.publishedAt),
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
      posts={posts.map((post) => ({
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
