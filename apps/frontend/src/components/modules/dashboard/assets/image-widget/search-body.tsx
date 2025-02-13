import Image from "next/image";

import { Button, Skeleton } from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";
import type { PaginationState } from "@tanstack/react-table";

import { Center } from "@/components/ui/center";
import { ErrorBox } from "@/components/ui/error-box";

interface SearchBodyProps {
  error?: string;
  isLoading: boolean;
  data: {
    id: string | number;
    src: string;
    alt: string;
  }[];
  pagination: PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  totalResults: number;
  handleInsert: (photoId: string | number) => void;
  isInserting?: boolean;
  insertingPhotoId?: string | number;
}

export function SearchBody({
  error,
  isLoading,
  data,
  pagination,
  setPagination,
  totalResults,
  handleInsert,
  isInserting,
  insertingPhotoId,
}: Readonly<SearchBodyProps>) {
  const photosView =
    data.length > 0 ? (
      <div className="grid grid-cols-4 gap-2">
        {data.map((photo) => (
          <slot
            onClick={() => handleInsert(photo.id)}
            key={photo.id}
            className="cursor-pointer"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              width={100}
              height={100}
              className={cn("h-auto w-auto hover:opacity-80", {
                "animate-pulse": isInserting && photo.id === insertingPhotoId,
              })}
            />
          </slot>
        ))}
      </div>
    ) : (
      <Center className="h-24 text-muted-foreground">No results</Center>
    );

  const searchBodyView = isLoading ? (
    <div className="grid grid-cols-4 gap-2">
      {[...Array.from({ length: 12 }).keys()].map((index) => (
        <Skeleton key={`skeleton-${index + 1}`} className="h-24 w-full" />
      ))}
    </div>
  ) : (
    photosView
  );

  return (
    <div className="space-y-4 rounded-lg border p-2">
      {error ? (
        <Center>
          <ErrorBox title="Failed to fetch photos" description={error} />
        </Center>
      ) : (
        searchBodyView
      )}
      <div className="flex justify-between">
        <Button
          onClick={() =>
            setPagination({
              pageIndex: pagination.pageIndex - 1,
              pageSize: pagination.pageSize,
            })
          }
          variant="outline"
          disabled={pagination.pageIndex === 0 || isLoading || !data}
        >
          Previous
        </Button>
        <Button
          onClick={() =>
            setPagination({
              pageIndex: pagination.pageIndex + 1,
              pageSize: pagination.pageSize,
            })
          }
          variant="outline"
          disabled={
            data.length === 0 ||
            isLoading ||
            !data ||
            pagination.pageIndex * pagination.pageSize >= totalResults
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
}
