import { useState } from "react";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@itsrakesh/ui";
import type { ISection } from "@publish-studio/core";

import { Icons } from "@/assets/icons";
import { AskForConfirmation } from "@/components/ui/ask-for-confirmation";
import usePlannerStore from "@/lib/stores/planner";
import { trpc } from "@/utils/trpc";

import { updateOrder } from "../common/strict-mode-droppable";

interface SectionActionsProps {
  setEditingSectionId: React.Dispatch<
    React.SetStateAction<ISection["_id"] | null>
  >;
  section: ISection;
}

export function SectionActions({
  setEditingSectionId,
  section,
}: Readonly<SectionActionsProps>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-6 w-8 p-0 data-[state=open]:bg-muted"
        >
          <Icons.RowActions className="size-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => {
            setEditingSectionId(section._id);
          }}
        >
          <Icons.Edit className="mr-2 size-4" />
          Rename
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DeleteSection section={section} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface DeleteSectionProps {
  section: ISection;
}

function DeleteSection({ section }: Readonly<DeleteSectionProps>) {
  const [askingForConfirmation, setAskingForConfirmation] = useState(false);

  const { sections } = usePlannerStore();

  const { mutateAsync: deleteSection, isLoading } =
    trpc.section.delete.useMutation();
  const { mutateAsync: reorder } = trpc.section.reorder.useMutation();
  const utils = trpc.useUtils();

  const handleDelete = async () => {
    try {
      const newSections = sections.filter((s) => s._id !== section._id);

      const updatedSections = updateOrder(newSections);

      await deleteSection([section._id]);
      await reorder(updatedSections);
      await utils.section.getAll.invalidate();
    } catch {
      // Ignore
    }
  };

  return askingForConfirmation ? (
    <AskForConfirmation
      onCancel={() => setAskingForConfirmation(false)}
      onConfirm={handleDelete}
      isLoading={isLoading}
      classNames={{
        confirmButton: "h-6 w-6",
        cancelButton: "h-6 w-6",
        container: "py-1 pl-2",
      }}
    />
  ) : (
    <slot
      onClick={() => setAskingForConfirmation(true)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          setAskingForConfirmation(true);
        }
      }}
      tabIndex={0}
      className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm text-destructive outline-none transition-colors hover:bg-accent hover:text-destructive data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
    >
      <Icons.Delete className="mr-2 size-4" />
      Delete
    </slot>
  );
}
