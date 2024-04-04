import { Button } from "@itsrakesh/ui";

import { Tooltip } from "@/components/ui/tooltip";

interface MenuItemProps {
  icon: React.ReactNode;
  onClick: () => void;
  tooltip: string;
  tooltipSide?: "top" | "right";
}

export function MenuItem({
  icon,
  onClick,
  tooltip,
  tooltipSide,
}: Readonly<MenuItemProps>) {
  return (
    <Tooltip content={tooltip} side={tooltipSide}>
      <Button
        onClick={onClick}
        variant="ghost"
        size="icon"
        className="rounded-none"
      >
        {icon}
      </Button>
    </Tooltip>
  );
}
