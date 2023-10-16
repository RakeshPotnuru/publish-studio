import {
    Button,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";
import { useRef, useState } from "react";

import { ErrorBox } from "@/components/ui/error-box";
import { Icons } from "@/components/ui/icons";
import { constants } from "@/config/constants";
import { shortenText } from "@/lib/text-shortner";

interface NewAssetDialogProps extends React.HTMLAttributes<HTMLDialogElement> {}

export function NewAssetDialog({ children, ...props }: NewAssetDialogProps) {
    const [file, setFile] = useState<File | null>(null);
    const [isDragActive, setIsDragActive] = useState(false);
    const [error, setError] = useState<{
        title: string;
        description: string;
    } | null>(null);

    const fileRef = useRef<HTMLInputElement>(null);

    const handleDrag = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();

        if (event.type === "dragenter" || event.type === "dragover") {
            setIsDragActive(true);
        } else if (event.type === "dragleave") {
            setIsDragActive(false);
        }
    };

    const validateFile = (file: File) => {
        const allowedMimeTypes = Object.values(constants.asset.ALLOWED_MIMETYPES);

        if (!allowedMimeTypes.includes(file.type as (typeof allowedMimeTypes)[number])) {
            setError({
                title: "Invalid file type",
                description: `Only ${allowedMimeTypes
                    .map(mimeType => mimeType.split("/")[1].toUpperCase())
                    .join(", ")} files are allowed`,
            });
            return false;
        }

        if (file.size > constants.asset.MAX_FILE_SIZE) {
            setError({
                title: "File too large",
                description: `Max file size is ${fileSize(constants.asset.MAX_FILE_SIZE)}`,
            });
            return false;
        }
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();

        setIsDragActive(false);

        const files = event.dataTransfer.files;

        validateFile(files[0]);

        setFile(files[0]);
        console.log(files);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;

        if (!files) return;

        validateFile(files[0]);

        setFile(files[0]);
        console.log(files);
    };

    const handleClose = () => {
        setFile(null);
        setError(null);
    };

    const fileSize = (size: number) => {
        const i = Math.floor(Math.log(size) / Math.log(1024));
        return (
            parseFloat((size / Math.pow(1024, i)).toFixed(2)) +
            " " +
            ["B", "kB", "MB", "GB", "TB"][i]
        );
    };

    return (
        <Dialog {...props}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload new asset</DialogTitle>
                    <DialogDescription>
                        Supported formats:{" "}
                        {Object.values(constants.asset.ALLOWED_MIMETYPES)
                            .map(mimeType => mimeType.split("/")[1].toUpperCase())
                            .join(", ")}
                        <br />
                        Max file size: {fileSize(constants.asset.MAX_FILE_SIZE)}
                    </DialogDescription>
                </DialogHeader>
                {error && <ErrorBox title={error.title} description={error.description} />}
                <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={cn(
                        "flex flex-col items-center space-y-4 rounded-lg border border-dashed p-10",
                        {
                            "border-primary": isDragActive,
                            "border-destructive": error,
                            "border-success": file && !error,
                        },
                    )}
                >
                    {file ? (
                        <div className="flex items-center space-x-4">
                            <Icons.imageFile className="h-8 w-8" />
                            <div className="flex flex-col">
                                <p className="text-sm font-medium">{shortenText(file.name, 20)}</p>
                                <p className="text-muted-foreground text-xs">
                                    {fileSize(file.size)}
                                </p>
                            </div>
                            <Button
                                onClick={handleClose}
                                size="icon"
                                variant="ghost"
                                className="rounded-full"
                            >
                                <Icons.close className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <>
                            <p className="text-muted-foreground">
                                Drag the image here or click &quot;+&quot; to upload
                            </p>
                            <input
                                ref={fileRef}
                                onChange={handleChange}
                                type="file"
                                accept={Object.values(constants.asset.ALLOWED_MIMETYPES).join(", ")}
                                className="hidden"
                            />
                            <Button
                                onClick={() => fileRef.current?.click()}
                                size="icon"
                                className="rounded-full"
                            >
                                <Icons.plus className="h-4 w-4" />
                            </Button>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
