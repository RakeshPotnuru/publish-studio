import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Skeleton,
} from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";

import { Icons } from "@/assets/icons";
import { AskForConfirmation } from "@/components/ui/ask-for-confirmation";
import { Heading } from "@/components/ui/heading";
import { Tooltip } from "@/components/ui/tooltip";
import { trpc } from "@/utils/trpc";

import { ImportDialog } from "./platforms/import-dialog";

interface ConnectionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  icon: string;
  isLoading: boolean;
  connected: boolean;
  username?: string;
  profile_url?: string;
  connectForm: React.ReactNode;
  editForm?: React.ReactNode;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isImportOpen?: boolean;
  setIsImportOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  onDisconnect: () => void;
  iconClassName?: React.HTMLProps<HTMLElement>["className"];
  importComponent?: React.ReactNode;
}

export function ConnectionCard({
  name,
  icon,
  isLoading,
  connected,
  username,
  profile_url,
  connectForm,
  editForm,
  isOpen,
  setIsOpen,
  isImportOpen,
  setIsImportOpen,
  onDisconnect,
  iconClassName,
  importComponent,
  ...props
}: Readonly<ConnectionCardProps>) {
  const [askingForConfirmation, setAskingForConfirmation] = useState(false);

  const utils = trpc.useUtils();

  const actionView = connected ? (
    <div className="flex flex-row items-center space-x-1">
      {askingForConfirmation ? (
        <AskForConfirmation
          onCancel={() => setAskingForConfirmation(false)}
          onConfirm={async () => {
            onDisconnect();
            setAskingForConfirmation(false);
            await utils.platforms.getAll.invalidate();
            await utils.auth.getMe.invalidate();
          }}
          classNames={{
            container: "border rounded-lg p-2",
          }}
        />
      ) : (
        <Button
          onClick={() => setAskingForConfirmation(true)}
          size="sm"
          variant="destructive"
        >
          Disconnect
        </Button>
      )}
      <div className="space-x-1">
        <ConnectionDialog
          open={isOpen}
          onOpenChange={setIsOpen}
          mode="edit"
          platform={name}
          form={editForm}
          tooltip="Edit account"
        >
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8"
            aria-label="Edit account"
          >
            <Icons.Edit />
          </Button>
        </ConnectionDialog>
        {importComponent && (
          <ImportDialog
            open={isImportOpen ?? false}
            onOpenChange={setIsImportOpen}
            platform={name}
            component={importComponent}
            tooltip="Import posts"
          >
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8"
              aria-label="Import posts"
            >
              <Icons.Import />
            </Button>
          </ImportDialog>
        )}
      </div>
    </div>
  ) : (
    <div>
      <ConnectionDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        mode="connect"
        platform={name}
        form={connectForm}
      >
        <Button size="sm">Connect</Button>
      </ConnectionDialog>
    </div>
  );

  return (
    <div
      className="flex flex-row justify-between rounded-lg border p-4"
      {...props}
    >
      <div className="flex flex-row space-x-2">
        <Image
          src={icon}
          alt={name}
          width={50}
          height={50}
          className={cn("rounded-lg", iconClassName)}
        />
        <div className="flex flex-col justify-center">
          <Heading level={3} className="flex flex-row items-center space-x-1">
            <span>{name}</span>
            {isLoading ? (
              <Skeleton className="size-6" />
            ) : (
              connected && (
                <Tooltip content="Connected" side="top">
                  <span>
                    <Icons.Connected className="text-sm text-success" />
                  </span>
                </Tooltip>
              )
            )}
          </Heading>
          {isLoading ? (
            <Skeleton className="h-4 w-24" />
          ) : (
            connected &&
            profile_url && (
              <Button
                variant="link"
                className="h-max w-max p-0 text-muted-foreground"
                asChild
              >
                <Link href={profile_url} target="_blank">
                  @{username}
                </Link>
              </Button>
            )
          )}
        </div>
      </div>
      {isLoading ? <Skeleton className="h-8 w-20" /> : actionView}
    </div>
  );
}

interface ConnectionDialogProps
  extends React.HTMLAttributes<HTMLDialogElement> {
  mode: "connect" | "edit";
  form: React.ReactNode;
  platform: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tooltip?: string;
}

function ConnectionDialog({
  mode,
  form,
  platform,
  children,
  tooltip,
  ...props
}: Readonly<ConnectionDialogProps>) {
  return (
    <Dialog {...props}>
      <Tooltip content={tooltip}>
        <DialogTrigger asChild>{children}</DialogTrigger>
      </Tooltip>
      <DialogContent onCloseAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>
            {mode === "connect" ? "Connect" : "Edit"} your {platform} account
          </DialogTitle>
        </DialogHeader>
        {form}
      </DialogContent>
    </Dialog>
  );
}
