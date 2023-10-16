import { Alert, AlertDescription, AlertTitle } from "@itsrakesh/ui";

import { Icons } from "./icons";

interface ErrorBoxProps {
    title: string;
    description: string;
}

export function ErrorBox({ title, description }: ErrorBoxProps) {
    return (
        <Alert variant="destructive">
            <Icons.error className="h-4 w-4" />
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{description}</AlertDescription>
        </Alert>
    );
}
