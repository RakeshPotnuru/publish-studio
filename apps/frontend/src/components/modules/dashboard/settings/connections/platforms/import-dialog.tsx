import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Separator,
  Skeleton,
} from "@itsrakesh/ui";
import type { PaginationState } from "@tanstack/react-table";

import { Center } from "@/components/ui/center";
import { ErrorBox } from "@/components/ui/error-box";
import { ButtonLoader } from "@/components/ui/loaders/button-loader";
import { Tooltip } from "@/components/ui/tooltip";
import { shortenText } from "@/utils/text-shortener";

interface ImportDialogProps extends React.HTMLAttributes<HTMLDialogElement> {
  component: React.ReactNode;
  platform: string;
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  tooltip?: string;
}

export function ImportDialog({
  component,
  platform,
  children,
  tooltip,
  ...props
}: Readonly<ImportDialogProps>) {
  return (
    <Dialog {...props}>
      <Tooltip content={tooltip}>
        <DialogTrigger asChild>{children}</DialogTrigger>
      </Tooltip>
      <DialogContent onCloseAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Import from {platform} account</DialogTitle>
        </DialogHeader>
        {component}
      </DialogContent>
    </Dialog>
  );
}

interface ImportPostsBodyProps {
  posts: {
    id: string;
    title: string;
  }[];
  isFetching: boolean;
  error?: string;
  setPagination: (state: PaginationState) => void;
  pageIndex: number;
  pageSize: number;
  isLoading: boolean;
  importingPost?: string;
  importedPosts: string[];
  handleImport: (id: string) => void;
}

export function ImportPostsBody({
  posts,
  isFetching,
  error,
  setPagination,
  pageIndex,
  pageSize,
  isLoading,
  importingPost,
  importedPosts,
  handleImport,
}: Readonly<ImportPostsBodyProps>) {
  const bodyView =
    posts.length > 0 ? (
      posts.map((post) => (
        <div key={post.id}>
          <div className="flex items-center justify-between space-x-2 px-2">
            <p title={post.title} className="text-sm">
              {pageIndex * pageSize + posts.indexOf(post) + 1}.{" "}
              {shortenText(post.title, 50)}
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
      <Center className="h-24 text-muted-foreground">No results</Center>
    );

  const bodyPendingView = isFetching
    ? Array.from({ length: 10 }).map((_, index) => (
        <div key={`skeleton-${index + 1}`}>
          <div className="flex items-center justify-between space-x-2 px-2">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-8 w-3/12" />
          </div>
          {index !== 9 && <Separator className="mt-2" />}
        </div>
      ))
    : bodyView;

  return (
    <div className="space-y-4">
      <div className="space-y-2 rounded-lg border py-2">
        {error ? (
          <Center>
            <ErrorBox title="Failed to fetch posts" description={error} />
          </Center>
        ) : (
          bodyPendingView
        )}
      </div>
      <div className="flex justify-between">
        <Button
          onClick={() =>
            setPagination({
              pageIndex: pageIndex - 1,
              pageSize,
            })
          }
          variant="outline"
          disabled={pageIndex === 0 || isFetching}
        >
          Previous
        </Button>
        <Button
          onClick={() =>
            setPagination({
              pageIndex: pageIndex + 1,
              pageSize,
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

interface ImportPostsBodyWithoutPreviousProps {
  posts: {
    id: string;
    title: string;
  }[];
  isFetching: boolean;
  error?: string;
  setPagination: (state: { pageSize: number; end_cursor?: string }) => void;
  cursors: string[];
  pageSize: number;
  end_cursor?: string;
  isLoading: boolean;
  importingPost?: string;
  importedPosts: string[];
  handleImport: (id: string) => void;
}

export function ImportPostsBodyWithoutPrevious({
  posts,
  isFetching,
  error,
  setPagination,
  cursors,
  pageSize,
  end_cursor,
  isLoading,
  importingPost,
  importedPosts,
  handleImport,
}: Readonly<ImportPostsBodyWithoutPreviousProps>) {
  const bodyView =
    posts.length > 0 ? (
      posts.map((post) => (
        <div key={post.id}>
          <div className="flex items-center justify-between space-x-2 px-2">
            <p title={post.title} className="text-sm">
              {posts.indexOf(post) +
                (cursors.indexOf(end_cursor ?? "") + 1) * pageSize +
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
      <Center className="h-24 text-muted-foreground">No results</Center>
    );

  const bodyPendingView = isFetching
    ? Array.from({ length: 10 }).map((_, index) => (
        <div key={`skeleton-${index + 1}`}>
          <div className="flex items-center justify-between space-x-2 px-2">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-8 w-3/12" />
          </div>
          {index !== 9 && <Separator className="mt-2" />}
        </div>
      ))
    : bodyView;

  return (
    <div className="space-y-4">
      <div className="space-y-2 rounded-lg border py-2">
        {error ? (
          <Center>
            <ErrorBox title="Failed to fetch posts" description={error} />
          </Center>
        ) : (
          bodyPendingView
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
          disabled={isFetching || !cursors.includes(end_cursor ?? "")}
        >
          Previous
        </Button>
        <Button
          onClick={() =>
            setPagination({
              pageSize,
              end_cursor: cursors.at(-1),
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
