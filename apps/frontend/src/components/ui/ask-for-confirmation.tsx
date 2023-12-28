import { Icons } from "@/assets/icons";
import { Button } from "@itsrakesh/ui";

interface AskForConfirmationProps {
    askingForConfirmation: boolean;
    onOpen: () => void;
    onCancel: () => void;
    onConfirm: () => void;
    isLoading?: boolean;
}

export function AskForConfirmation({
    askingForConfirmation,
    onCancel,
    onOpen,
    onConfirm,
    isLoading,
}: AskForConfirmationProps) {
    return askingForConfirmation ? (
        <div className="animate-slide-left space-x-1 text-sm">
            <span>Confirm?</span>
            <Button
                onClick={onConfirm}
                variant="destructive"
                size="icon"
                className="size-8"
                disabled={isLoading}
            >
                {isLoading ? <Icons.Loading className="animate-spin" /> : <Icons.Check />}
            </Button>
            <Button onClick={onCancel} variant="outline" size="icon" className="size-8">
                <Icons.Close />
            </Button>
        </div>
    ) : (
        <Button onClick={onOpen} size="sm" variant="destructive">
            Disconnect
        </Button>
    );
}
