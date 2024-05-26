import { useState } from "react";
import Image from "next/image";
import Script from "next/script";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";

import { Images } from "@/assets/images";
import { Assets } from "@/components/modules/dashboard/assets";

import { Cloudinary } from "./cloudinary";
import { Giphy } from "./giphy";
import { ImageKit } from "./imagekit";
import { Pexels } from "./pexels";
import { Unsplash } from "./unsplash";

export type TInsertImageOptions =
  | {
      src: string;
      alt: string;
      title?: string;
      hasCaption: false;
      captionMarkdown?: string;
    }
  | {
      src: string;
      alt: string;
      title?: string;
      hasCaption: true;
      captionMarkdown: string;
    };

interface ImageWidgetProps extends React.HTMLAttributes<HTMLDialogElement> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isWidget?: boolean;
  onImageInsert?: (options: TInsertImageOptions) => void;
}

export type TProvider =
  | "Unsplash"
  | "Pexels"
  | "Assets"
  | "ImageKit"
  | "Cloudinary"
  | "Giphy";

export function ImageWidget({
  isWidget,
  onImageInsert,
  ...props
}: Readonly<ImageWidgetProps>) {
  const [provider, setProvider] = useState<TProvider>();

  return (
    <>
      <Dialog {...props}>
        <DialogContent className="min-w-max">
          <DialogHeader>
            <DialogTitle>
              Pick an image {provider && `from ${provider}`}
            </DialogTitle>
            <DialogDescription>
              Choose from third-party image providers or your assets.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-2 rounded-lg border p-2">
            <Button
              onClick={() => {
                setProvider("Unsplash");
              }}
              className={cn("h-24 bg-unsplash hover:opacity-80", {
                "h-9": provider,
                "opacity-50": provider === "Unsplash",
              })}
            >
              <Image
                src={Images.unsplashLogo}
                alt="Unsplash"
                width={100}
                height={50}
                className="h-6 w-auto"
              />
            </Button>
            <Button
              onClick={() => {
                setProvider("Pexels");
              }}
              className={cn("h-24 bg-pexels hover:opacity-80", {
                "h-9": provider,
                "opacity-50": provider === "Pexels",
              })}
            >
              <Image
                src={Images.pexelsLogo}
                alt="Pexels"
                width={100}
                height={50}
                className="h-8 w-auto"
              />
            </Button>
            <Button
              onClick={() => {
                setProvider("Giphy");
              }}
              className={cn("h-24 bg-giphy hover:opacity-80", {
                "h-9": provider,
                "opacity-50": provider === "Giphy",
              })}
            >
              <Image
                src={Images.giphyLogo}
                alt="Giphy"
                width={100}
                height={50}
                className="h-6 w-auto"
              />
            </Button>
            <Button
              onClick={() => {
                setProvider("ImageKit");
              }}
              className={cn("h-24 bg-imagekit-foreground hover:opacity-80", {
                "h-9": provider,
                "opacity-50": provider === "ImageKit",
              })}
            >
              <Image
                src={Images.imagekitLogo}
                alt="ImageKit"
                width={100}
                height={50}
                className="h-6 w-auto"
              />
            </Button>
            <Button
              onClick={() => {
                setProvider("Cloudinary");
              }}
              className={cn("h-24 bg-cloudinary hover:opacity-80", {
                "h-9": provider,
                "opacity-50": provider === "Cloudinary",
              })}
            >
              <Image
                src={Images.cloudinaryLogo}
                alt="Cloudinary"
                width={100}
                height={50}
                className="h-6 w-auto"
              />
            </Button>

            <Button
              onClick={() => {
                setProvider("Assets");
              }}
              variant="outline"
              className={cn("h-24", {
                "h-9": provider,
                "opacity-50": provider === "Assets",
              })}
            >
              My Assets
            </Button>
          </div>
          {provider && (
            <div>
              {provider === "Unsplash" && onImageInsert && (
                <Unsplash onImageInsert={onImageInsert} />
              )}
              {provider === "Pexels" && onImageInsert && (
                <Pexels onImageInsert={onImageInsert} />
              )}
              {provider === "Assets" && (
                <Assets isWidget={isWidget} onImageInsert={onImageInsert} />
              )}
              {provider === "ImageKit" && onImageInsert && (
                <ImageKit onImageInsert={onImageInsert} />
              )}
              {provider === "Cloudinary" && onImageInsert && (
                <Cloudinary onImageInsert={onImageInsert} />
              )}
              {provider === "Giphy" && onImageInsert && (
                <Giphy onImageInsert={onImageInsert} />
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Script
        src="https://media-library.cloudinary.com/global/all.js"
        strategy="lazyOnload"
      />
    </>
  );
}
