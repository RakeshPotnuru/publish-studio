import { Dialog, DialogContent } from "@itsrakesh/ui";

import { Assets } from "../modules/dashboard/assets";

interface ImageWidgetProps extends React.HTMLAttributes<HTMLDialogElement> {
    open: boolean;
    setOpen: (open: boolean) => void;
    isWidget?: boolean;
    onAdd?: (url: string) => void;
}

export function ImageWidget({ isWidget, onAdd, open, setOpen, ...props }: ImageWidgetProps) {
    return (
        <Dialog open={open} onOpenChange={setOpen} {...props}>
            <DialogContent className="min-w-max">
                <div className="my-4">
                    <Assets isWidget={isWidget} onAdd={onAdd} />
                </div>
            </DialogContent>
        </Dialog>
    );
}
