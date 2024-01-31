import Image from "next/image";

import { Dialog, DialogContent, DialogTrigger } from "@itsrakesh/ui";

import imageLoader from "@/utils/image-loader";

interface AssetProps extends React.HTMLAttributes<HTMLDialogElement> {
    url: string;
    name: string;
}

export function AssetDialog({ children, url, name, ...props }: Readonly<AssetProps>) {
    return (
        <Dialog {...props}>
            <DialogTrigger>{children}</DialogTrigger>
            <DialogContent>
                <div className="m-4">
                    <Image
                        loader={imageLoader}
                        src={url}
                        alt={name}
                        width={500}
                        height={400}
                        loading="lazy"
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
