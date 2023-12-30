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
import { Pexels } from "./pexels";
import { Unsplash } from "./unsplash";

interface ImageWidgetProps extends React.HTMLAttributes<HTMLDialogElement> {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isWidget?: boolean;
    onAdd?: (url: string) => void;
}

export type TProvider = "unsplash" | "pexels" | "assets";

export function ImageWidget({ isWidget, onAdd, ...props }: Readonly<ImageWidgetProps>) {
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
                        })}
                    >
                        <Image src={Images.unsplashLogo} alt="Unsplash" width={100} height={50} />
                    </Button>
                    <Button
                        onClick={() => {
                            setProvider("pexels");
                        }}
                        className={cn("bg-pexels h-24 hover:opacity-80", {
                            "h-9": provider,
                        })}
                    >
                        <Image src={Images.pexelsLogo} alt="Pexels" width={100} height={50} />
                    </Button>
                    <Button
                        onClick={() => {
                            setProvider("assets");
                        }}
                        variant="outline"
                        className={cn("h-24", {
                            "h-9": provider,
                        })}
                    >
                        My Assets
                    </Button>
                </div>
                {provider && (
                    <div>
                        {provider === "unsplash" && <Unsplash />}
                        {provider === "pexels" && <Pexels />}
                        {provider === "assets" && <Assets isWidget={isWidget} onAdd={onAdd} />}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
