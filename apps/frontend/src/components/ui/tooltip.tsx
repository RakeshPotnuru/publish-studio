import {
    TooltipContent,
    Tooltip as TooltipPrimitive,
    TooltipProvider,
    TooltipTrigger,
} from "@itsrakesh/ui";

interface TooltipProps {
    content: string;
    children: React.ReactNode;
    side?: "top" | "bottom" | "left" | "right";
    asChild?: boolean;
}

export function Tooltip({ content, children, side = "bottom", asChild = true }: TooltipProps) {
    return (
        <TooltipProvider>
            <TooltipPrimitive>
                <TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
                <TooltipContent side={side}>
                    <p>{content}</p>
                </TooltipContent>
            </TooltipPrimitive>
        </TooltipProvider>
    );
}
