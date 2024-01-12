import { Button, Skeleton } from "@itsrakesh/ui";
import { PaginationState } from "@tanstack/react-table";
import Image from "next/image";

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
    handleInsert: (photoId: string | number) => void;
}

export function SearchBody({
    error,
    isLoading,
    data,
    pagination,
    setPagination,
    handleInsert,
}: Readonly<SearchBodyProps>) {
    const photosView =
        data.length !== 0 ? (
            <div className="grid grid-cols-4 gap-2">
                {data.map(photo => (
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
                            className="h-auto w-auto hover:opacity-80"
                        />
                    </slot>
                ))}
            </div>
        ) : (
            <Center className="text-muted-foreground h-24">No results</Center>
        );

    const searchBodyView = isLoading ? (
        <div className="grid grid-cols-4 gap-2">
            {Array.from(Array(12).keys()).map(index => (
                <Skeleton key={`skeleton-${index + 1}`} className="h-24 w-full" />
            ))}
        </div>
    ) : (
        photosView
    );

    return (
        <div className="space-y-4 rounded-lg border p-2">
            {error ? (
                <ErrorBox title="Failed to fetch photos" description={error} />
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
                    disabled={data.length === 0 || isLoading || !data}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
