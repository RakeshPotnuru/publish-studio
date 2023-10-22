import { DevTool, type PLACEMENT } from "@hookform/devtools";
import { Control } from "react-hook-form";

interface HookFormDevToolProps {
    control: Control<any>;
    placement?: PLACEMENT;
}

export function HookFormDevTool({ control, placement = "bottom-left" }: HookFormDevToolProps) {
    return <DevTool control={control} placement={placement} />;
}
