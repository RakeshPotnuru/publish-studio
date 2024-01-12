import { PaginationState } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { z } from "zod";

import { trpc } from "@/utils/trpc";
import { TInsertImageOptions } from ".";
import { SearchBody } from "./search-body";
import { SearchInput, formSchema } from "./search-input";

interface UnsplashProps {
    onImageInsert: ({ ...options }: TInsertImageOptions) => void;
}

export function Unsplash({ onImageInsert }: Readonly<UnsplashProps>) {
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
    } = trpc.unsplash.search.useQuery(
        {
            query: query,
            page: pageIndex + 1,
            per_page: pageSize,
        },
        {
            enabled: false,
        },
    );

    const handleSearch = (data: z.infer<typeof formSchema>) => {
        if (data.query.trim().length === 0) {
            return;
        }

        setQuery(data.query);
    };

    const handleInsert = (photoId: string | number) => {
        const photo = data?.data.photos.response?.results.find(photo => photo.id === photoId);
        if (photo) {
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
            searchPhotos();
        }
    }, [pageIndex, pageSize, query, searchPhotos]);

    return (
        <div className="space-y-4">
            <SearchInput provider="unsplash" handleSubmit={handleSearch} isLoading={isFetching} />
            <SearchBody
                error={data?.data.photos.errors?.[0] || error?.message}
                isLoading={isFetching}
                data={
                    data?.data.photos.response?.results.map(photo => ({
                        id: photo.id,
                        src: photo.urls.regular,
                        alt: photo.alt_description || photo.user.name,
                    })) || []
                }
                pagination={{ pageIndex, pageSize }}
                setPagination={setPagination}
                handleInsert={handleInsert}
            />
        </div>
    );
}
