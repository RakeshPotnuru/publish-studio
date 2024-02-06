import { useRef, useState } from "react";
import { useParams } from "next/navigation";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  toast,
} from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";
import type { IAsset } from "@publish-studio/core";
import { constants, MimeType } from "@publish-studio/core/src/config/constants";
import axios from "axios";
import mongoose from "mongoose";

import { Icons } from "@/assets/icons";
import { ErrorBox } from "@/components/ui/error-box";
import { ButtonLoader } from "@/components/ui/loaders/button-loader";
import { Tooltip } from "@/components/ui/tooltip";
import { formatFileSize } from "@/utils/format-file-size";
import { shortenText } from "@/utils/text-shortener";
import { trpc } from "@/utils/trpc";

interface NewAssetDialogProps extends React.HTMLAttributes<HTMLDialogElement> {
  enableTooltip?: boolean;
}

export function NewAssetDialog({
  children,
  enableTooltip = false,
  ...props
}: Readonly<NewAssetDialogProps>) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<{
    title: string;
    description: string;
  } | null>(null);
  const [open, setOpen] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const utils = trpc.useUtils();
  const { projectId } = useParams();

  const { mutateAsync: getPresignedURL, isLoading: isUrlLoading } =
    trpc.assets.upload.useMutation({
      onError: (error) => {
        setError({
          title: "Upload failed",
          description: error.message,
        });
      },
    });

  const { mutateAsync: deleteAsset, isLoading: isAssetLoading } =
    trpc.assets.delete.useMutation();

  const handleDrag = (event: React.DragEvent<HTMLSlotElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (event.type === "dragenter" || event.type === "dragover") {
      setIsDragActive(true);
    } else if (event.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const validateFile = (file: File) => {
    const allowedMimeTypes = Object.values(MimeType);

    if (
      !allowedMimeTypes.includes(file.type as (typeof allowedMimeTypes)[number])
    ) {
      setError({
        title: "Invalid file type",
        description: `Only ${allowedMimeTypes
          .map((mimeType) => mimeType.split("/")[1].toUpperCase())
          .join(", ")} files are allowed`,
      });
      return false;
    }

    if (file.size > constants.asset.MAX_FILE_SIZE) {
      setError({
        title: "File too large",
        description: `Max file size is ${formatFileSize(constants.asset.MAX_FILE_SIZE)}`,
      });
      return false;
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLSlotElement>) => {
    event.preventDefault();
    event.stopPropagation();

    setIsDragActive(false);

    const files = event.dataTransfer.files;

    validateFile(files[0]);

    setFile(files[0]);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files) return;

    validateFile(files[0]);

    setFile(files[0]);
  };

  const handleRemove = () => {
    setFile(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) return;

    let data;
    try {
      const { data: response } = await getPresignedURL({
        file: {
          mimetype: file.type as IAsset["mimetype"],
          size: file.size,
          originalname: file.name,
        },
        project_id: projectId
          ? new mongoose.Types.ObjectId(projectId.toString())
          : undefined,
      });
      data = response;
    } catch (error) {
      console.log(error);
    }

    if (!data) return;

    try {
      const formData = new FormData();
      for (const [field, value] of Object.entries(data.submitTo.fields)) {
        formData.append(field, value);
      }
      formData.append("file", file);

      await axios.post(data.submitTo.url, formData);

      toast.success("Image has been uploaded successfully");

      await utils.assets.getAll.invalidate();
      setOpen(false);
    } catch {
      await deleteAsset([data.asset._id]);
    }
  };

  const isLoading = isUrlLoading || isAssetLoading;

  return (
    <Dialog open={open} onOpenChange={setOpen} {...props}>
      <Tooltip content="Upload asset" hidden={!enableTooltip}>
        <DialogTrigger asChild>{children}</DialogTrigger>
      </Tooltip>
      <DialogContent onCloseAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Upload new asset</DialogTitle>
          <DialogDescription>
            Supported formats:{" "}
            {Object.values(MimeType)
              .map((mimeType) => mimeType.split("/")[1].toUpperCase())
              .join(", ")}
            <br />
            Max file size: {formatFileSize(constants.asset.MAX_FILE_SIZE)}
          </DialogDescription>
        </DialogHeader>
        {error && (
          <ErrorBox title={error.title} description={error.description} />
        )}
        <slot
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={cn(
            "flex cursor-default flex-col items-center space-y-4 rounded-lg border border-dashed p-10",
            {
              "border-primary": isDragActive,
              "border-destructive": error,
              "border-success": file && !error,
            },
          )}
        >
          {file ? (
            <div className="flex items-center space-x-4">
              <Icons.ImageFile className="size-8" />
              <div className="flex flex-col">
                <p className="text-sm font-medium">
                  {shortenText(file.name, 20)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </p>
              </div>
              <Button
                onClick={handleRemove}
                size="icon"
                variant="ghost"
                className="rounded-full"
                disabled={isLoading}
              >
                <Icons.Close className="size-4" />
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
                accept={Object.values(MimeType).join(", ")}
                className="hidden"
              />
              <Button
                onClick={() => fileRef.current?.click()}
                size="icon"
                className="rounded-full"
              >
                <Icons.Add className="size-4" />
              </Button>
            </>
          )}
        </slot>
        <DialogFooter>
          <Button onClick={handleUpload} disabled={!file || isLoading}>
            <ButtonLoader isLoading={isLoading}>Upload</ButtonLoader>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
