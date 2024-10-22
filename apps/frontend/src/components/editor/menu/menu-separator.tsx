import { Separator } from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";

interface MenuSeparatorProps {
  isBubbleMenu?: boolean;
}

export function MenuSeparator({ isBubbleMenu }: Readonly<MenuSeparatorProps>) {
  return (
    <Separator
      orientation="vertical"
      className={cn("h-6 bg-gray-500", {
        "h-9 bg-border": isBubbleMenu,
      })}
    />
  );
}
