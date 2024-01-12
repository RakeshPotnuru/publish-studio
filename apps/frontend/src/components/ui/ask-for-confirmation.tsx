import { Button } from "@itsrakesh/ui";

import { Icons } from "@/assets/icons";
import { cn } from "@itsrakesh/utils";

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
                "animate-slide-left flex items-center space-x-1 text-sm",
                classNames?.container,
            )}
        >
            <span>Confirm?</span>
            <Button
                onClick={onConfirm}
                variant="destructive"
                size="icon"
                className={cn("h-8 w-8", classNames?.confirmButton)}
                disabled={isLoading}
            >
                {isLoading ? <Icons.Loading className="animate-spin" /> : <Icons.Check />}
            </Button>
            <Button
                onClick={onCancel}
                variant="outline"
                size="icon"
                className={cn("h-8 w-8", classNames?.cancelButton)}
            >
                <Icons.Close />
            </Button>
        </div>
    );
}
