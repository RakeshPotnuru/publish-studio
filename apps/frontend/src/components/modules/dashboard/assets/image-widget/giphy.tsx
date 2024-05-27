import { useContext } from "react";
import Image from "next/image";

import type { IGif } from "@giphy/js-types";
import {
  Grid,
  SearchBar,
  SearchContext,
  SearchContextManager,
} from "@giphy/react-components";
import { ScrollArea, Skeleton } from "@itsrakesh/ui";
import { useTheme } from "next-themes";

import { Images } from "@/assets/images";
import { DotsLoader } from "@/components/ui/loaders/dots-loader";

import type { TInsertImageOptions } from ".";

interface GiphyProps {
  onImageInsert: ({ ...options }: TInsertImageOptions) => void;
}

const Loader = () => <DotsLoader className="my-2" />;

export function Giphy({ onImageInsert }: Readonly<GiphyProps>) {
  const { theme } = useTheme();

  if (!process.env.NEXT_PUBLIC_GIPHY_API_KEY) {
    throw new Error("NEXT_PUBLIC_GIPHY_API_KEY is not set.");
  }

  return (
    <SearchContextManager
      apiKey={process.env.NEXT_PUBLIC_GIPHY_API_KEY}
      theme={{ darkMode: theme === "dark" }}
    >
      <Components onImageInsert={onImageInsert} theme={theme} />
    </SearchContextManager>
  );
}

function Components({
  onImageInsert,
  theme,
}: Readonly<{
  onImageInsert: ({ ...options }: TInsertImageOptions) => void;
  theme?: string;
}>) {
  const { fetchGifs, searchKey, isFetching } = useContext(SearchContext);

  const handleInsert = (gif: IGif) => {
    onImageInsert({
      src: gif.images.original.url,
      alt: gif.title,
      title: gif.title,
      hasCaption: true,
      captionMarkdown: `(_Gif by [${gif.user?.display_name ?? gif.username ?? "Giphy"}](${
        (gif.user as unknown as { profile_url: string })?.profile_url ??
        "https://giphy.com"
      })_) on [Giphy](https://giphy.com)`,
    });
  };

  return (
    <>
      <SearchBar placeholder="Search GIPHY..." className="border" />
      <ScrollArea className="mt-4 h-96 rounded-lg border p-2">
        {isFetching ? (
          <div className="grid grid-cols-3 gap-2">
            {[...Array.from({ length: 9 }).keys()].map((index) => (
              <Skeleton key={`skeleton-${index + 1}`} className="h-28 w-full" />
            ))}
          </div>
        ) : (
          <Grid
            key={searchKey}
            width={500}
            columns={3}
            fetchGifs={fetchGifs}
            onGifClick={handleInsert}
            loader={Loader}
            noLink
            hideAttribution
            className="cursor-pointer"
          />
        )}
      </ScrollArea>
      <Image
        src={
          theme === "dark"
            ? Images.poweredByGiphyDark
            : Images.poweredByGiphyLight
        }
        alt="Powered by Giphy"
        width={120}
        height={120}
        className="m-auto mt-4"
      />
    </>
  );
}
