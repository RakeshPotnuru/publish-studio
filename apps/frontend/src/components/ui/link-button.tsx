import type { LinkProps } from "next/link";
import Link from "next/link";

import { Button } from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";

interface LinkButtonProps extends React.ComponentProps<typeof Button> {
  href: LinkProps["href"];
  target?: React.HTMLAttributeAnchorTarget;
}

/**
 * Renders a button that acts as a link.
 *
 * @param children - The content of the button.
 * @param className - Additional CSS class names for the button.
 * @param href - The URL to navigate to when the button is clicked.
 * @param target - The target attribute for the link.
 * @param props - Additional props to pass to the button component.
 * @returns The rendered link button component.
 */
export function LinkButton({
    children,
    className,
    href,
    target = "_blank",
    ...props
}: Readonly<LinkButtonProps>) {
    return (
        <Button
            type="button"
            variant="link"
            className={cn("h-max p-0", className)}
            asChild
            {...props}
        >
            <Link href={href} target={target}>
                {children}
            </Link>
        </Button>
    );
}
