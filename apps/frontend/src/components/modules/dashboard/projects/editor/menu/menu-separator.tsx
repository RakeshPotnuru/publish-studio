import { Separator } from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";

interface MenuSeparatorProps {
    isBubbleMenu?: boolean;
}

export function MenuSeparator({ isBubbleMenu }: MenuSeparatorProps) {
    return (
        <Separator
            orientation="vertical"
            className={cn("h-6 bg-gray-500", {
                "bg-border h-9": isBubbleMenu,
            })}
        />
    );
}
