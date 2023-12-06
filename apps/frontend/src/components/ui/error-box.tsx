import { Alert, AlertDescription, AlertTitle } from "@itsrakesh/ui";

import { Icons } from "../../assets/icons";

interface ErrorBoxProps {
    title: string;
    description: string;
}

export function ErrorBox({ title, description }: Readonly<ErrorBoxProps>) {
    return (
        <Alert variant="destructive" className="bg-red-200 dark:bg-red-950">
            <Icons.Error className="h-4 w-4" />
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{description}</AlertDescription>
        </Alert>
    );
}
