import { useEffect, useState } from "react";

import { toast } from "@itsrakesh/ui";
import type { PaginationState } from "@tanstack/react-table";
import type { z } from "zod";

import { trpc } from "@/utils/trpc";

import type { TInsertImageOptions } from ".";
import { SearchBody } from "./search-body";
import type { formSchema } from "./search-input";
import { SearchInput } from "./search-input";

interface UnsplashProps {
  onImageInsert: ({ ...options }: TInsertImageOptions) => void;
}

export function Unsplash({ onImageInsert }: Readonly<UnsplashProps>) {
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 12,
  });
  const [query, setQuery] = useState<string>("");
  const [insertingPhotoId, setInsertingPhotoId] = useState<string | number>("");

  const {
    data,
    isFetching,
    error,
    refetch: searchPhotos,
  } = trpc.unsplash.search.useQuery(
    {
      query: query,
      page: pageIndex + 1,
      per_page: pageSize,
    },
    {
      enabled: false,
      staleTime: 60_000,
    }
  );

  const handleSearch = (data: z.infer<typeof formSchema>) => {
    if (data.query.trim().length === 0) {
      return;
    }

    setQuery(data.query);
  };

  const { mutateAsync: triggerDownload, isLoading } =
    trpc.unsplash.triggerDownload.useMutation({
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const handleInsert = async (photoId: string | number) => {
    const photo = data?.data.photos.response?.results.find(
      (photo) => photo.id === photoId
    );
    if (photo) {
      setInsertingPhotoId(photo.id);

      await triggerDownload(photo.links.download_location);

      onImageInsert({
        src: photo.urls.regular,
        alt: photo.alt_description || photo.user.name,
        title: photo.alt_description || photo.user.name,
        hasCaption: true,
        captionMarkdown: `(_Photo by [${photo.user.name}](${photo.user.portfolio_url}) on [Unsplash](${photo.links.html})_)`,
      });
    }
  };

  useEffect(() => {
    if (query) {
      searchPhotos().catch(() => {
        // Ignore
      });
    }
  }, [pageIndex, pageSize, query, searchPhotos]);

  return (
    <div className="space-y-4">
      <SearchInput
        provider="Unsplash"
        handleSubmit={handleSearch}
        isLoading={isFetching}
      />
      <SearchBody
        error={data?.data.photos.errors?.[0] || error?.message}
        isLoading={isFetching}
        data={
          data?.data.photos.response?.results.map((photo) => ({
            id: photo.id,
            src: photo.urls.regular,
            alt: photo.alt_description || photo.user.name,
          })) || []
        }
        pagination={{ pageIndex, pageSize }}
        setPagination={setPagination}
        totalResults={data?.data.photos.response?.total || 0}
        handleInsert={handleInsert}
        isInserting={isLoading}
        insertingPhotoId={insertingPhotoId}
      />
    </div>
  );
}
