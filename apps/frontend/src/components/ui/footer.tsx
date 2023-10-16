"use client";

import { Button } from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";

interface FooterProps extends React.HTMLAttributes<HTMLElement> {}

export function Footer({ className, ...props }: FooterProps) {
    return (
        <footer
            className={cn(
                "dark:bg-background-dark flex flex-row items-center space-x-4",
                className,
            )}
            {...props}
        >
            <p className="text-sm">&copy; Publish Studio</p>
            <Button variant="link" className="h-max p-0" asChild>
                Privacy Policy
            </Button>
            <Button variant="link" className="h-max p-0" asChild>
                Terms of Service
            </Button>
        </footer>
    );
}
