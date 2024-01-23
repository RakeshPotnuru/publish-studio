import {
    Button,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";
import Image from "next/image";
import { useState } from "react";

import { Images } from "@/assets/images";
import { Assets } from "@/components/modules/dashboard/assets";
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

export type TProvider = "unsplash" | "pexels" | "assets" | "imagekit";

export function ImageWidget({ isWidget, onImageInsert, ...props }: Readonly<ImageWidgetProps>) {
    const [provider, setProvider] = useState<TProvider>();

    return (
        <Dialog {...props}>
            <DialogContent className="min-w-max">
                <DialogHeader>
                    <DialogTitle>Pick an image</DialogTitle>
                    <DialogDescription>
                        Choose from third-party image providers or your assets.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-3 gap-2">
                    <Button
                        onClick={() => {
                            setProvider("unsplash");
                        }}
                        className={cn("bg-unsplash h-24 hover:opacity-80", {
                            "h-9": provider,
                            "opacity-50": provider !== "unsplash",
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
                            setProvider("pexels");
                        }}
                        className={cn("bg-pexels h-24 hover:opacity-80", {
                            "h-9": provider,
                            "opacity-50": provider !== "pexels",
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
                            setProvider("assets");
                        }}
                        variant="outline"
                        className={cn("h-24", {
                            "h-9": provider,
                            "opacity-50": provider !== "assets",
                        })}
                    >
                        My Assets
                    </Button>
                    <Button
                        onClick={() => {
                            setProvider("imagekit");
                        }}
                        className={cn("bg-imagekit-foreground h-24 hover:opacity-80", {
                            "h-9": provider,
                            "opacity-50": provider !== "imagekit",
                        })}
                    >
                        <Image
                            src={Images.imagekitLogo}
                            alt="ImageKit"
                            width={100}
                            height={50}
                            className="h-8 w-auto"
                        />
                    </Button>
                </div>
                {provider && (
                    <div>
                        {provider === "unsplash" && onImageInsert && (
                            <Unsplash onImageInsert={onImageInsert} />
                        )}
                        {provider === "pexels" && onImageInsert && (
                            <Pexels onImageInsert={onImageInsert} />
                        )}
                        {provider === "assets" && (
                            <Assets isWidget={isWidget} onImageInsert={onImageInsert} />
                        )}
                        {provider === "imagekit" && onImageInsert && (
                            <ImageKit onImageInsert={onImageInsert} />
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
