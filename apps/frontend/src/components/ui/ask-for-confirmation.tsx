import { Button } from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";

import { Icons } from "@/assets/icons";

import { Tooltip } from "./tooltip";

interface AskForConfirmationProps {
  onCancel: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  classNames?: {
    confirmButton?: string;
    cancelButton?: string;
    container?: string;
  };
}

export function AskForConfirmation({
  onCancel,
  onConfirm,
  isLoading,
  classNames,
}: Readonly<AskForConfirmationProps>) {
  return (
    <div
      className={cn(
        "flex animate-slide-left items-center space-x-1 text-sm",
        classNames?.container,
      )}
    >
      <span>Confirm?</span>
      <Tooltip content="Yes">
        <Button
          onClick={onConfirm}
          variant="destructive"
          size="icon"
          className={cn("h-8 w-8", classNames?.confirmButton)}
          disabled={isLoading}
          aria-label="Confirm"
        >
          {isLoading ? (
            <Icons.Loading className="animate-spin" />
          ) : (
            <Icons.Check />
          )}
        </Button>
      </Tooltip>
      <Tooltip content="No">
        <Button
          onClick={onCancel}
          variant="outline"
          size="icon"
          className={cn("h-8 w-8", classNames?.cancelButton)}
          disabled={isLoading}
          aria-label="Cancel"
        >
          <Icons.Close />
        </Button>
      </Tooltip>
    </div>
  );
}
