import { DevTool, type PLACEMENT } from "@hookform/devtools";
import type { Control } from "react-hook-form";

interface HookFormDevToolProps {
    control: Control<any>;
    placement?: PLACEMENT;
}

export function HookFormDevTool({
    control,
    placement = "bottom-left",
}: Readonly<HookFormDevToolProps>) {
    return <DevTool control={control} placement={placement} />;
}
