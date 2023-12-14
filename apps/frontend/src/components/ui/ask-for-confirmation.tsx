import { Icons } from "@/assets/icons";
import { Button } from "@itsrakesh/ui";

interface AskForConfirmationProps {
    askingForConfirmation: boolean;
    onOpen: () => void;
    onCancel: () => void;
    onConfirm: () => void;
}

export function AskForConfirmation({
    askingForConfirmation,
    onCancel,
    onOpen,
    onConfirm,
}: AskForConfirmationProps) {
    return askingForConfirmation ? (
        <div className="animate-slide-left space-x-1 text-sm">
            <span>Confirm?</span>
            <Button onClick={onConfirm} variant="destructive" size="icon" className="h-8 w-8">
                <Icons.Check />
            </Button>
            <Button onClick={onCancel} variant="outline" size="icon" className="h-8 w-8">
                <Icons.Close />
            </Button>
        </div>
    ) : (
        <Button onClick={onOpen} size="sm" variant="destructive">
            Disconnect
        </Button>
    );
}
