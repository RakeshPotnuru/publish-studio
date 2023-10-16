import { Dialog, DialogContent, DialogTrigger } from "@itsrakesh/ui";
import Image from "next/image";

interface AssetProps extends React.HTMLAttributes<HTMLDialogElement> {
    url: string;
    name: string;
}

export function AssetDialog({ children, url, name, ...props }: AssetProps) {
    return (
        <Dialog {...props}>
            <DialogTrigger>{children}</DialogTrigger>
            <DialogContent>
                <div className="m-4">
                    <Image src={url} alt={name} width={500} height={400} />
                </div>
            </DialogContent>
        </Dialog>
    );
}
