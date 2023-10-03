import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@itsrakesh/ui";

interface ConnectDialogProps {
    mode: "connect" | "edit";
    form: React.ReactNode;
    platform: string;
    children: React.ReactNode;
}

export function PlatformDialog({ mode, form, platform, children }: ConnectDialogProps) {
    return (
        <Dialog>
            <DialogTrigger>{children}</DialogTrigger>
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
