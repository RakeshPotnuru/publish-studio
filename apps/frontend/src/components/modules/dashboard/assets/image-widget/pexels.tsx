import { useEffect, useState } from "react";

import type { PaginationState } from "@tanstack/react-table";
import type { z } from "zod";

import { trpc } from "@/utils/trpc";

import type { TInsertImageOptions } from ".";
import { SearchBody } from "./search-body";
import type { formSchema } from "./search-input";
import { SearchInput } from "./search-input";

interface PexelsProps {
  onImageInsert: ({ ...options }: TInsertImageOptions) => void;
}

export function Pexels({ onImageInsert }: Readonly<PexelsProps>) {
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 12,
  });
  const [query, setQuery] = useState<string>("");

  const {
    data,
    isFetching,
    error,
    refetch: searchPhotos,
  } = trpc.pexels.search.useQuery(
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

  const handleInsert = (photoId: string | number) => {
    const id = typeof photoId === "string" ? Number.parseInt(photoId) : photoId;
    const photo = data?.data.photos.photos.find((photo) => photo.id === id);
    if (photo) {
      onImageInsert({
        src: photo.src.original,
        alt: photo.alt || photo.photographer,
        title: photo.alt || photo.photographer,
        hasCaption: true,
        captionMarkdown: `(_Photo by [${photo.photographer}](${photo.photographer_url ?? "https://pexels.com"}) on [Pexels](${photo.url ?? "https://pexels.com"})_)`,
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
        provider="Pexels"
        handleSubmit={handleSearch}
        isLoading={isFetching}
      />
      <SearchBody
        error={error?.message}
        isLoading={isFetching}
        data={
          data?.data.photos.photos.map((photo) => ({
            id: photo.id,
            src: photo.src.original,
            alt: photo.alt || photo.photographer,
          })) || []
        }
        pagination={{ pageIndex, pageSize }}
        setPagination={setPagination}
        totalResults={data?.data.photos.total_results ?? 0}
        handleInsert={handleInsert}
      />
    </div>
  );
}
