import { Tooltip } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@itsrakesh/ui";

interface ImportDialogProps extends React.HTMLAttributes<HTMLDialogElement> {
    mode: "connect" | "edit";
    form: React.ReactNode;
    platform: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    tooltip?: string;
}

export function PlatformDialog({
    mode,
    form,
    platform,
    children,
    tooltip,
    ...props
}: Readonly<ImportDialogProps>) {
    return (
        <Dialog {...props}>
            <Tooltip content={tooltip}>
                <DialogTrigger asChild>{children}</DialogTrigger>
            </Tooltip>
            <DialogContent onCloseAutoFocus={e => e.preventDefault()}>
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
