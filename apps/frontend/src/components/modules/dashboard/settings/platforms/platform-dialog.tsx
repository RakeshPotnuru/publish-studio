import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@itsrakesh/ui";

interface ConnectDialogProps extends React.HTMLAttributes<HTMLDialogElement> {
    mode: "connect" | "edit";
    form: React.ReactNode;
    platform: string;
}

export function PlatformDialog({ mode, form, platform, children }: Readonly<ConnectDialogProps>) {
    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
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
